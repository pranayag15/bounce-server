import mongoose from 'mongoose'
import express from 'express'
const morgan = require('morgan'); 
const cors = require('cors')
const app = express()
const moment = require('moment')

import routerMiddleware from './routes/index'

mongoose.Promise = require('bluebird');
app.use(express.json())
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors())

// var connectionString = "mongodb://127.0.0.1:27017/bounce";
var connectionString = "mongodb://bounce:bounce#123@ds347467.mlab.com:47467/bounce"
mongoose.connect(connectionString, { useNewUrlParser: true }, function (err) {
  if (err) throw err;
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.json("api connected")
})
var isodate = new Date().toISOString()
console.log(isodate)
// var now = moment().toDate();
// console.log(now)

app.use('/api', routerMiddleware);

app.listen(process.env.PORT || 5100, () => {
  console.log("Server up on PORT 5100")
});