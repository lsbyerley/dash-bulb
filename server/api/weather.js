require('dotenv').config();
const router = require('express').Router()
const mcache = require('memory-cache');
const DarkSky = require('dark-sky')
const DarkSkyClient = new DarkSky(process.env.DARKSKY_TOKEN)
const env = (process.env.NODE_ENV === 'development') ? 'development' : 'production';

const cache = function cache(duration) {

	return function(req, res, next) {
		const key = '__dashbulb-cache-__' + req.originalUrl || req.url;
		const cachedBody = mcache.get(key);
		if (cachedBody) {
			if (env === 'development') { console.log('HITTIN CACHE') }
			res.send(cachedBody);
			return;
		} else {
			if (env === 'development') { console.log('FRESH RESPONSE') }
			res.sendResponse = res.send;
			res.send = function(body) {
				if (res.statusCode === 200) { // only cache if its a successful response
					mcache.put(key, body, duration * 1000);
				}
				res.sendResponse(body);
			};
			next();
		}
	};
};

router.get('/current-weather', cache(300), async (req, res, next) => {

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
