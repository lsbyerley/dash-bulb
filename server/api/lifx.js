const router = require('express').Router();
const Lifx = require('lifx-http-api')
const lifxClient = new Lifx({ bearerToken: '' });
const bulbId = ''

router.get('/bulb-status', async (req, res, next) => {

  try {
    const clientRes = await lifxClient.listLights('id:'+bulbId);
    res.status(200).json(clientRes)
  } catch(err) {
    console.error(err)
    res.status(500).json({'error': 'FAILED_LIST_LIGHTS: '+err})
  }

})

router.post('/update-bulb', async (req, res, next) => {

  const color = `hue:${req.body.hue} saturation:${req.body.saturation}`

  try {
    const clientRes = await lifxClient.setState('id:'+req.body.id, {
      power: req.body.power,
      color: color,
      brightness: req.body.brightness,
    })
    res.status(200).json(clientRes)
  } catch(err) {
    console.error(err)
    res.status(500).json({'error': 'FAILED_UPDATE_LIGHT: '+err})
  }

})

module.exports = router
