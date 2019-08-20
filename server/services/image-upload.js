const multer = require('multer')
const multerS3 = require('multer-s3')
const config = require('../config')

const AWS = require('aws-sdk')
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION
})

const s3 = new AWS.S3()

const fileFilter = (req, file, cb) => {
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        cb(null, true)
    } else {
        cb(new Error("Invalid file type. Only JPEG and PNG is allowed!"), false)
    }
}

const upload = multer({
    fileFilter, // As same as -> fileFilter: fileFilter

    storage: multerS3({
        s3, // As same as -> s3: s3
        bucket: config.AWS_S3_BUCKET_NAME,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = upload