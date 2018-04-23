const router = require('express').Router()
const DarkSky = require('dark-sky')
const DarkSkyClient = new DarkSky('')

router.get('/current-weather', async (req, res, next) => {

  try {
    const latitude = 35.2045978, longitude = -80.8709869;
    const weatherRes = await DarkSkyClient.options({ latitude, longitude }).get()
    res.status(200).json(weatherRes)
  } catch(err) {
    console.error(err)
    res.status(500).json({'error': 'FAILED_WEATHER: '+err})
  }

})

module.exports = router
