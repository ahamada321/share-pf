const User = require('./models/user')
const Token = require('./models/token')
const { normalizeErrors } = require('./helpers/mongoose')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const config = require('../../config')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY);

const VERIFICATION_EMAIL = 'verification_email'
const PR_RESET_EMAIL = 'pw_reset_email'

function sendEmailTo(sendTo, sendMsg, token, hostname) {
    let msg = {}

    if(sendMsg == VERIFICATION_EMAIL) {
        msg = {
            to: sendTo,
            from: 'noreply@ap-trainer.com',
            subject: '[アカウント発行メール]あなたのアカウントを有効化してください',
            text: "以下のリンクをクリックしてアカウントを有効化してください。\n\nhttps:\/\/" + hostname + '\/register\/' + token
        }
    } else if (sendMsg == PR_RESET_EMAIL) {
        msg = {
            to: sendTo,
            from: 'noreply@ap-trainer.com',
            subject: '[パスワードリセット]パスワードを再設定してください',
            text: "以下のリンクをクリックしてパスワードを再設定してください。\n\nhttps:\/\/" + hostname + '\/login\/reset\/newpassword\/' + token
        }
    } else {
        return res.status(422).send({errors: [{title: "Could not send email!", detail: "Please select appropriate email content!"}]})
    }

    sgMail.send(msg);
}

exports.getUser = function(req, res) {
    const reqUserId = req.params.id
    const user = res.locals.user

    if(reqUserId == user.id) {
        // Display all
        User.findById(reqUserId, function(err, foundUser) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            } 
            return res.json(foundUser)
        })
    } else {
        // Restrict some data
        User.findById(reqUserId)
            .select('-revenue -customer -password')
            .exec(function(err, foundUser) {
                if(err) {
                    return res.status(422).send({errors: normalizeErrors(err.errors)})
                } 
                return res.json(foundUser)
            })
    }
}

//Reffering from ./routes/user.js
exports.auth = function(req, res) {
    const { email, password } = req.body

    if(!password || !email) {
        return res.status(422).send({errors: [{title: "Data missing!", detail: "Provide email and password!"}]})
    }

    User.findOne({email}, function(err, user) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        if(!user) {
            return res.status(422).send({errors: [{title: "Invalid user!", detail: "先にユーザー登録してください！"}]})
        }
        if(!user.isVerified) {
            return res.status(422).send({errors: [{title: "Not verified user!", detail: "受信メールからからアカウントをアクティベーションしてください！"}]})
        }

        if(user.hasSamePassword(password)) {
            // return JWT token
            const token = jwt.sign({
                userId: user.id,
                username: user.username,
                userRole: user.userRole,
              }, config.SECRET, { expiresIn: '24h' })

            return res.json(token)
            
        } else {
            return res.status(422).send({errors: [{title: "Invalid Data!", detail: "Wrong email or password!"}]})
        }
    })
}

exports.FBauth = function(req, res) {//Under development
    const FBuserID = req.body.id

     User.findOne({FBuserID}, function(err, foundUser) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        if(!foundUser) {
            return res.status(422).send({errors: [{title: "User not found!", detail: "Please sign up before login!"}]})
        }
        if(!foundUser.isVerified) {
            return res.status(422).send({errors: [{title: "Not verified user!", detail: "受信メールからからアカウントをアクティベーションしてください！"}]})
        }

        // if(user.hasSamePassword(password)) {
            // return JWT token
            const token = jwt.sign({
                userId: foundUser.id,
                username: foundUser.username,
                userRole: foundUser.userRole,
              }, config.SECRET, { expiresIn: '24h' })

            return res.json(token)

        // } 
        // else {
            // return res.status(422).send({errors: [{title: "Invalid Data!", detail: "Wrong email or password!"}]})
        // }
    })
}

exports.register = function(req, res) {
    /*
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const passwordConfirmation = req.body.passwordConfirmation
    */
   const { FBuserID, username, email, password, passwordConfirmation } = req.body


    if(!password || !email) {
        return res.status(422).send({errors: [{title: "Data missing!", detail: "Provide email and password!"}]})
    }

    if(password != passwordConfirmation) {
        return res.status(422).send({errors: [{title: "Invalid password!", detail: "Password is not as same as confirmation!"}]})
    }

    if(FBuserID) {
        User.findOne({FBuserID}, function(err, existingUser) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }
            if(existingUser) {
                return res.status(422).send({errors: [{title: "Invalid Facebook ID!", detail: "User with this Facebook ID already exist!"}]})
            }
        })
   }


    User.findOne({email}, function(err, existingUser) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        if(existingUser) {
            return res.status(422).send({errors: [{title: "Invalid email!", detail: "User with this email already exist!"}]})
        }

        // Filling user infomation with ../models/user.js format
        const user = new User({
            FBuserID,
            username,
            email,
            password

            /* It is same as above
            FBuserID: FBuserID,
            username: username,
            email: email,
            password: password
            */
        })

        User.create(user, function(err, newUser) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }

            const token = jwt.sign({
                userId: newUser.id,
                //username: newUser.username
              }, config.SECRET, { expiresIn: '2h' })
            
            sendEmailTo(newUser.email, VERIFICATION_EMAIL, token, req.hostname)
            return res.json({'registered': true});
        })

        // user.save(function(err, ) {
        //     if(err) {
        //         return res.status(422).send({errors: normalizeErrors(err.errors)})
        //     }

        //     // Create verification token for this user
        //     //const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            
        //     return res.json({'registered': true});
        // })
    })
}

exports.updateUser = function(req, res) {
    const userData = req.body
    const reqUserId = req.params.id
    const user = res.locals.user // This is logined user infomation.

    if(reqUserId == user.id) { // Checking logined user editing his/her profile.
        User.updateOne({ _id: user.id}, userData, () => {})

        const token = jwt.sign({
            userId: user.id,
            username: userData.username,
            userRole: user.userRole,
          }, config.SECRET, { expiresIn: '24h' })

        return res.json(token)
    } else {
        return res.status(422).send({
            errors: {
                title: "Invalid user!",
                detail: "Cannot edit other user profile!"
            }
        })
    }
}

exports.emailVerification = function (req, res) {
    const verifyToken = req.params.token
    let user
    if(verifyToken) {

        try{
            user = jwt.verify(verifyToken, config.SECRET)
        } catch(err) {
            return res.status(422).send({errors: [{title: "Invalid token!", detail: "Token format is invalid!"}]})
        }
        
        User.findById(user.userId)
            .select('-password')
            .exec(function(err, foundUser) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }

            if(foundUser) {
                foundUser.isVerified = true
                foundUser.save(function(err) {
                    if(err) {
                        return res.status(422).send({errors: normalizeErrors(err.errors)})
                    }                    
                    return res.json({'registered': true});
                })
            }
        })

    } else {
        return res.status(422).send({
            errors: {
                title: "No data!",
                detail: "There is no verify infomation!"
            }
        })
    }
}

exports.sendPasswordResetLink = function (req, res) {
    const { email } = req.body

    if(!email) {
        return res.status(422).send({errors: [{title: "Data missing!", detail: "Provide email!"}]})
     }

     User.findOne({email}, function(err, foundUser) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        if(!foundUser) {
            return res.status(422).send({errors: [{title: "Invalid user!", detail: "User does not exist!"}]})
        }
        // if(!user.isVerified) {
        //     return res.status(422).send({errors: [{title: "Not verified user!", detail: "Please activate account from recieved email!"}]})
        // }

        const token = jwt.sign({
            userId: foundUser.id,
            email: foundUser.email
          }, config.SECRET, { expiresIn: '2h' })
        
        sendEmailTo(foundUser.email, PR_RESET_EMAIL, token, req.hostname)
        return res.json({'sent_pw_reset': true});
    })
}

exports.setNwePassword = function(req, res) {
    const { email, password, passwordConfirmation } = req.body
    const verifyToken = req.params.token
    let user

    if(!password || !email) {
        return res.status(422).send({errors: [{title: "Data missing!", detail: "Provide email and password!"}]})
     }
 
    if(password != passwordConfirmation) {
        return res.status(422).send({errors: [{title: "Invalid password!", detail: "Password is not as same as confirmation!"}]})
     }

    if(verifyToken) {
        try{
            user = jwt.verify(verifyToken, config.SECRET)
        } catch(err) {
            return res.status(422).send({errors: [{title: "Invalid token!", detail: "Token format is invalid!"}]})
        }
    }

    if(email != user.email) {
        return res.status(422).send({errors: [{title: "email is incorrect!", detail: "Email is incorrect as we sent!" }]})
    }

    User.findById(user.userId, function(err, foundUser) {
        if(err) {
            return res.status(422).send({errors: normalizeErrors(err.errors)})
        }
        foundUser.password = password
        foundUser.save(function(err) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }
            return res.status(200).send(foundUser)
        })
    })
}



function parseToken(token) {
    // split token string [Bearer XXXXXXXXX] with ' ' and return XXXXXXXXX
    return jwt.verify(token.split(' ')[1], config.SECRET)
}

function notAuthorized(res) {
    return res.status(401).send({errors: [{title: "Not authorized!", detail: "You need to login to get access!"}]})
}

exports.authMiddleware = function(req, res, next) {
    const token = req.headers.authorization
    
    if(token) {
        const user = parseToken(token)

        User.findById(user.userId, function(err, user) {
            if(err) {
                return res.status(422).send({errors: normalizeErrors(err.errors)})
            }

            if(user) {
                res.locals.user = user
                next()
            } else {
                return notAuthorized(res)
            }
        })
    } else {
        return notAuthorized(res)
    }
}