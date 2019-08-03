var express = require('express')
var router = express.Router()

const user = require('./users')
const vehicle = require('./vehicle')

router.use('/', user)
router.use('/', vehicle)

module.exports = router