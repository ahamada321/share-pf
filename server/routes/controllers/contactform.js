
const config = require('../../config')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(config.SENDGRID_API_KEY);


exports.sendFormMessage = function(req, res) {
    const { username, email, msg, rentalemail } = req.body

    if(!username || !email) {
        return res.status(422).send({errors: [{title: "Data missing!", detail: "Provide your name and email!"}]})
    }

    if(!msg) {
        return res.status(422).send({errors: [{title: "Data missing!", detail: "Provide your questions or requests!"}]})
    }

    if(!rentalemail) {
        rentalemail = 'a.hamada.biz@gmail.com'
    }

    const sendMsg = {
        to: rentalemail,
        from: email,
        subject: '[' + username + ' 様]から以下の問い合わせがきました',
        text: msg
    }
    sgMail.send(sendMsg);

    return res.json({'Sent': true})
}