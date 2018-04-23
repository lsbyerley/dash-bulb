const router = require('express').Router();
const lifx = require('./lifx')
const weather = require('./weather')

router.use(lifx)
router.use(weather)

module.exports = router
