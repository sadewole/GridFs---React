const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const {
  mongoURL
} = require('./config');

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}))
app.use(methodOverride('_method'));

const conn = mongoose.createConnection(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, () => {
  console.log('Connected to db');
});

let gridFSBucket

conn.once('open', () => {
  // init stream
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads'
  });

  exports.gfs = gridFSBucket
});

app.use('/api/v1', require('./route'));

const server = app.listen(5500, () => {
  const mode = app.get('env')
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Server running on ${mode} mode and listening at http://%s:%s ${host} ${port}`);
});