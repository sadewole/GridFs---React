const express = require('express')
const gfs = require('../index')
const uploads = require('../middleware/Gridfs')

const router = express()

//  @route GET /
//  desc loads form
router.get('/', (req, res) => {
    res.send('Hello world');
});

// @route POST /uploads
//  desc uploads file to db
router.post('/upload', uploads.single('file'), (req, res) => {
    res.json({
        file: req.file,
    });
});

// @route GET files
// @desc Display all files in JSON
router.get('/upload', (req, res) => {
    gfs.gfs.files.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist',
            });
        }

        // files exist
        return res.status(200).json(files);
    });
});

// @route GET file
// @desc Display single file in JSON
router.get('/upload/:filename', (req, res) => {
    gfs.gfs.files.findOne({
            filename: req.params.filename,
        },
        (err, file) => {
            // check if files
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exist',
                });
            }

            // file exist
            return res.status(200).json(file);
        }
    );
});

// @route GET image
// @desc Display single image
router.get('/image/:filename', (req, res) => {
    gfs.gfs.files.findOne({
            filename: req.params.filename,
        },
        (err, file) => {
            // check if files
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exist',
                });
            }
            // check if image
            if (
                file.contentType === 'image/jpeg' ||
                file.contentType === 'image/png' ||
                file.contentType === 'image/jpg'
            ) {
                // read output to browser
                const readstream = gfs.gfs.createReadStream(file.filename);
                console.log('passed steam ');
                readstream.pipe(res);
            } else {
                return res.status(404).json({
                    err: 'No file exist',
                });
            }
        }
    );
});


module.exports = router