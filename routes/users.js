import User from '../models/user'
import vehicle from '../models/vehicle';
const express = require('express');
const router = express.Router();

router.get('/users', async (req, res) => {
  User.find({}).populate().exec()
    .then(data => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err)
    });
})

router.get('/users/:userid', (req, res) => {
  console.log(req.params.userid)
  User.findById(req.params.userid)
    .then(data => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err)
    });
})

router.post('/users', async (req, res) => {
  console.log(req.body)
  const newUser = await new User(req.body);
  newUser.save((err, data) => {
    if (err) {
      res.status(500).json(err)
    }
    res.status(200).json(data)
  })
})

router.put('/users/:userid', (req, res) => {
  console.log(req.body)
  console.log(req.params.userid)
  User.findByIdAndUpdate(req.params.userid, req.body,(err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json(err)
    }
    console.log(data)
    res.status(200).json(data)
  })
})

router.get('/uservehicles/:vehicleid', (req, res) => {
  console.log(req.params.vehicleid)
  User.findById(req.params.vehicleid).populate("vehicles").exec()
    .then(data => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err)
    });
})

router.get('/uservehicles', (req, res) => {
  User.find({}).populate("vehicles").exec()
    .then(data => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json(err)
    });
})


module.exports = router;  