const Rental = require('./models/rental')
const User = require('./models/user')
const { normalizeErrors } = require('./helpers/mongoose')


exports.getRentalById = function(req, res) {
    const rentalId = req.params.id

    Rental.findById(rentalId)
            .populate('user', 'username -_id')
            .populate('bookings', 'startAt endAt status -_id')
            .exec(function(err, foundRental) {
                if(err) {
                    return res.status(422).send({
                        errors: {
                            title: "Rental error!",
                            detail: "Could not find Rental!"
                        }
                    })
                }
                return res.json(foundRental)
            })
}

exports.getRentals = function(req, res) {
    Rental.find({})
          .select('-bookings')
          .exec(function(err, foundRentals){
            res.json(foundRentals)
          })

}

exports.getOwnerRentals = function(req,res) {
    const user = res.locals.user

    Rental.where({user})
            .populate('bookings')
            .exec(function(err, foundRentals) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                return res.json(foundRentals)
            })
}


exports.deleteRental = function(req, res) {
    const user = res.locals.user

    Rental.findById(req.params.id) 
            .populate('user', '_id')
            .populate({
                path: 'bookings',
                select: 'startAt',
                match: { startAt: { $gt: new Date()}} // &gt: greater than. <- Pick up future than now.
            })
            .exec(function(err, foundRental) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                if(user.id != foundRental.user.id) {
                    return res.status(422).send({
                        errors: {
                            title: "Invalid user!",
                            detail: "You are not rental owner!"
                        }
                    })
                }
                if(foundRental.bookings.length > 0) {
                    return res.status(422).send({
                        errors: {
                            title: "Active bookings!",
                            detail: "Can not delete rental with active bookings!"
                        }
                    })
                }
                foundRental.remove(function(err) {
                    if (err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)})
                    }
                    return res.json({"status": "deleted"})
                })
            })
}

exports.updateRental = function(req, res) {
    const rentalData = req.body
    const user = res.locals.user

    Rental.findById(req.params.id)
            .populate('user', '_id')
            .exec(async function(err, foundRental) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                if(foundRental.user.id != user.id) {
                    return res.status(422).send({
                        errors: {
                            title: "Invalid user!",
                            detail: "You are not rental owner!"
                        }
                    })
                }

                try {
                    const updatedRental = await Rental.updateMany({ _id: foundRental.id}, rentalData, () => {})
                    return res.json(updatedRental)
                } catch(err) {
                    return res.json(err)
                }
            })
}

exports.createRental = function(req, res) {
    const { rentalname, age, height, bust, weight, image, video, province, nearStation, hourlyPrice, description, shared } = req.body
    const user = res.locals.user

    //referring from ../models/rental.js
    const rental = new Rental({
        rentalname,
        age,
        height,
        bust,
        weight,
        image,
        video,
        province,
        nearStation,
        hourlyPrice,
        description,
        shared
    })

    rental.user = user

    Rental.create(rental, function(err, newRental) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }

        User.updateMany({ _id: user.id}, {$push: { rentals: newRental}}, function(){})
        return res.json(newRental)
    })
}