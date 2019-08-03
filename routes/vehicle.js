import Vehicle from '../models/vehicle'
import User from '../models/user'

const express = require('express');
const router = express.Router();

router.get('/vehicles', async (req, res) => {
  Vehicle.find({})
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

router.get('/vehicles/:vehicleid', async (req, res) => {
  Vehicle.findById(req.params.vehicleid)
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.post('/vehicles', async (req, res) => {
  console.log(req.body)
  const user = req.body.user
  const newVehicle = await new Vehicle(req.body)
  newVehicle.save(async (err, data) => {
    if (err) {
      res.status(500).json(err)
    }
    var findUser = await User.findById(user)
    console.log(findUser)
    findUser.vehicles.push(data._id)
    await findUser.save()
    res.status(200).json(data)
  })
})

router.put('/vehicles/:vehicleid', (req, res) => {
  console.log(req.body)
  console.log(req.params.vehicleid)
  Vehicle.findByIdAndUpdate(req.params.vehicleid, req.body, (err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json(err)
    }
    console.log(data)
    res.status(200).json(data)
  })
})

//distance api
//nearby?lan=12&lon=21&range=35
router.get('/nearby', (req, res) => {
  console.log(typeof (req.query.lat))
  var mainData;
  Vehicle
    .aggregate([{
      $addFields: {
        _id: null,
        neww: { $add: ["$seats", "$perkm"] }
      }
    }])
    .then(data => {
      mainData = data
      console.log(req.query)
      for (var i = 0; i < data.length; i++) {
        let lat = data[i].latitude
        let lon = data[i].longitude
        console.log("hehehehe", lat, lon)
        var distance = Math.acos(Math.sin(req.query.lat * Math.PI / 180) * Math.sin(lat * Math.PI / 180) + Math.cos(req.query.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.cos(req.query.lon * Math.PI / 180 - lon * Math.PI / 180)) * 6371//
        mainData[i].distance = distance
        console.log(distance)
      }
      res.status(200).send(mainData)
    })
})

router.get('/sortwise', (req, res) => {
  console.log(req.query.daterequired)
  var required = req.query.daterequired
  Vehicle
    // .find({})
    .aggregate([{
      $addFields: {
        day: { $dayOfMonth: "$availabilityDate" },
        month: { $month: "$availabilityDate" },
        year: { $year: "$availabilityDate" }
      }
    },
    {
      $match: {
        'day': { $gte: 2 }
      }//{ $eq: req.query.daterequired }
    }
    ])
    .then(data => {
      var mainData = data
      for (var i = 0; i < data.length; i++) {
        let lat = data[i].latitude
        let lon = data[i].longitude
        console.log("hehehehe", lat, lon)
        var distance = Math.acos(Math.sin(req.query.lat * Math.PI / 180) * Math.sin(lat * Math.PI / 180) + Math.cos(req.query.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.cos(req.query.lon * Math.PI / 180 - lon * Math.PI / 180)) * 6371//
        mainData[i].distance = distance
        console.log(distance)
      }
      mainData.sort(function (a, b) {
        return a.distance - b.distance;
      });
      res.status(200).send(mainData)
    })
})

router.get('/sortvehicle', (req, res) => {
  var pick = req.query.pick
  var drop = req.query.drop
  var mainData = []
  Vehicle.find({})
    .then(data => {
      for (var i=0; i < data.length; i++) {
        if (data[i].pickup.date <= pick && data[i].drop.date >= drop) {
          mainData.push(data[i])
        }
      }
      var sortedData = JSON.parse(JSON.stringify(mainData));
      for (var i = 0; i < mainData.length; i++) {
        let lat = mainData[i].latitude
        let lon = mainData[i].longitude
        // console.log("hehehehe", lat, lon)
        var distance = Math.acos(Math.sin(req.query.lat * Math.PI / 180) * Math.sin(lat * Math.PI / 180) + Math.cos(req.query.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.cos(req.query.lon * Math.PI / 180 - lon * Math.PI / 180)) * 6371
        sortedData[i].distance = distance
      }
      sortedData.sort(function (a, b) {
        return a.distance - b.distance;
      });
      res.status(200).send(sortedData)
    })
})

//get gt and lt from query
router.get("/sort", async (req, res) => {
  console.log(req.query)
  Vehicle.find({
    pickupTime: {
      $gte: ("2019-07-29T12:38:17.820Z"),
      $lt: ("2019-07-29T14:38:17.820Z")
    }
  }).then(data => {
    console.log(data)
    res.status(200).json(data)
  })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

///setislive/:vehicleid?set=true
router.post('/setislive/:vehicleid', (req, res) => {
  console.log(req.params.vehicleid)
  Vehicle.findById(req.params.vehicleid)
    .then(foundVehicle => {
      console.log(foundVehicle)
      foundVehicle.islive = req.query.set;
      return foundVehicle.save()
    })
    .then(data => {
      res.status(200).json(data)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

router.delete('/vehicles/:vehicleid', (req, res) => {
  Vehicle.findById(req.params.vehicleid)
    .then(async foundVehicle => {
      var user = foundVehicle.user
      var foundUser = await User.findById(user)
      console.log(foundUser)
      var index = foundUser.vehicles.indexOf(foundVehicle._id);
      if (index > -1) {
        foundUser.vehicles.splice(index, 1);
      }
      await foundUser.save()
      var result = await Vehicle.findByIdAndDelete(foundVehicle._id)
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
})

module.exports = router