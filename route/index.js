const express = require('express')
const gfs = require('../index')
const uploads = require('../middleware/Gridfs')
const mongoose = require('mongoose')
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
    const files = gfs.gfs
    files.find().toArray((err, files) => {
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

// @route GET image
// @desc Display single image
router.get('/image/:filename', (req, res) => {
    const files = gfs.gfs
    files.find({
        filename: req.params.filename,
    }).toArray((err, file) => {
        // check if files
        if (!file || file.length === 0) {
            console.log('got here')
            return res.status(404).json({
                err: 'No file exist',
            });
        }
        // check if image
        if (
            file[0].contentType === 'image/jpeg' ||
            file[0].contentType === 'image/png' ||
            file[0].contentType === 'image/jpg'
        ) {
            // read output to browser
            const readstream = files.openDownloadStreamByName(file[0].filename);
            readstream.pipe(res);
        } else {
            return res.status(404).json({
                err: 'No file exist',
            });
        }
    });
});

// @route delete image
// @desc remove image from bucket
router.delete('/image/:id', (req, res) => {
    const files = gfs.gfs
    const id = new mongoose.Types.ObjectId(req.params.id)
    files.delete(id, (err, gridStore) => {
        if (err) {
            return res.status(400).json({
                err
            })
        }

        return res.status(200).json({
            success: true
        })
    })
})


module.exports = router