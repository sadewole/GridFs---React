const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const {
    mongoURL
} = require('../config')

// create storage engine
const storage = new GridFsStorage({
    url: mongoURL,
    file: (req, file) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) return reject(err);

                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads',
                    };
                    resolve(fileInfo);
                });
            });
        } else {
            return null
        }
    },
});

module.exports = uploads = multer({
    storage,
});