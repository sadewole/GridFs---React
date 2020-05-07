const express = require('express');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const mongoURI = 'mongodb://localhost:27017/gridfs';
const app = express();

// Middleware
app.use(express.json());
app.use(methodOverride('_method'));

const conn = mongoose.createConnection(mongoURI, () => {
    console.log('Connected to db');
});

let gfs;
conn.once('open', () => {
    // init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
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
    },
});
const uploads = multer({
    storage
});

//  @route GET /
//  desc loads form
app.get('/api/v1/', (req, res) => {
    res.send('Hello world');
});

// @route POST /uploads
//  desc uploads file to db
app.post('/api/v1/upload', uploads.single('file'), (req, res) => {
    res.json({
        file: req.file
    });
});


// @route GET files
// @desc Display all files in JSON
app.get('/api/v1/upload', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            })
        }

        // files exist
        return res.status(200).json(files)
    })
})


// @route GET file
// @desc Display single file in JSON
app.get('/api/v1/upload/:filename', (req, res) => {
    console.log(req.params.filename)
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        // check if files
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist'
            })
        }

        // file exist
        return res.status(200).json(file)
    })
})


// @route GET image
// @desc Display single image
app.get('/api/v1/image/:filename', (req, res) => {
    gfs.files.findOne({
        filename: req.params.filename
    }, (err, file) => {
        // check if files
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist'
            })
        }
        console.log('before content')
        // check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png' || file.contentType === 'image/jpg') {
            // read output to browser
            console.log('got here')
            const readstream = gfs.createReadStream(file.filename)
            console.log('passed steam ')
            readstream.pipe(res)
        } else {
            return res.status(404).json({
                err: 'No file exist'
            })
        }
    })
})

const server = app.listen(5500, () => {
    const host = server.address().address;
    const port = server.address().port;

    console.log(`Server listening at http://%s:%s ${host} ${port}`);
});