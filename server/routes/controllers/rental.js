const Rental = require('./models/rental')
const User = require('./models/user')
const { normalizeErrors } = require('./helpers/mongoose')


exports.getRentalById = function(req, res) {
    const rentalId = req.params.id

    Rental.findById(rentalId)
            //.populate('user', 'username -_id')
            .populate('user') // Need to consider security in future.
            //.populate('bookings', 'startAt endAt status -_id')
            .populate('bookings', 'startAt endAt status _id') // Need to consider security in future.
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
    // Rental.find({})
    Rental.where({shared: true})
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

exports.getUserFavouriteRentals = function(req,res) {
    const user = res.locals.user

    Rental.where({favouritesFrom: user})
            // .populate('bookings')
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
            .exec(function(err, foundRental) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }
                if(foundRental.user.id !== user.id) {
                    return res.status(422).send({errors: {title: "Invalid user!", detail: "You are not rental owner!"}})
                }

                try {
                    const updatedRental = Rental.updateOne({ _id: foundRental.id}, rentalData, () => {})
                    return res.json(updatedRental)
                } catch(err) {
                    return res.json(err)
                }
            })
}

exports.toggleFavourite = function(req, res) {
    const user = res.locals.user
    const rentalId = req.params.id

    Rental.findById(rentalId)
            // .populate('favouritesFrom', '_id')
            .exec(function(err, foundRental) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                }

                // const index = foundRental.favouritesFrom.findIndex((x) => x.id === user.id)
                const index = foundRental.favouritesFrom.indexOf(user.id)

                if(index >= 0) {
                    foundRental.favouritesFrom.splice(index, 1) // Dlete user from array.
                } else {
                    foundRental.favouritesFrom.push(user)
                }

                try {
                    Rental.updateOne({ _id: foundRental.id}, foundRental, () => {})
                    return res.json(index)
                } catch(err) {
                    return res.json(err)
                }
            })
}


exports.createRental = function(req, res) {
    const { 
        rentalname, 
        selectedCategory,
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
    } = req.body
    const user = res.locals.user

    //referring from ../models/rental.js
    const rental = new Rental({
        rentalname,
        selectedCategory,
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

        User.updateOne({ _id: user.id}, {$push: { rentals: newRental}}, function(){})
        return res.json(newRental)
    })
}