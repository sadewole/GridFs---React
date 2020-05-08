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

const conn = mongoose.createConnection(mongoURL, () => {
  console.log('Connected to db');
});


conn.once('open', () => {
  // init stream
  let gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  exports.gfs = gfs
});


app.use('/api/v1', require('./route'));

const server = app.listen(5500, () => {
  const mode = app.get('env')
  const host = server.address().address;
  const port = server.address().port;

  console.log(`Server running on ${mode} mode and listening at http://%s:%s ${host} ${port}`);
});