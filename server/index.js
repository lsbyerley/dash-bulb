const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')
const helmet = require('helmet')
const compression = require('compression')
const api = require('./api')
let config = require('../nuxt.config.js')

const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// for all dates
process.env.TZ = 'America/New_York';

// express config
app.use(compression());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(cookieParser());
app.set('port', port)
app.use(express.static(__dirname + '/dist'));

// Security Settings
app.use(helmet.referrerPolicy())		// Sets "Referrer-Policy: no-referrer".

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: [ "'self'" ],
		scriptSrc: [
			"'self'",
			"'unsafe-eval'",
			"'unsafe-inline'",
			'ajax.googleapis.com',
			'www.google-analytics.com',
			'cdnjs.cloudflare.com'
		],
		styleSrc: [
			"'self'",
			"'unsafe-inline'",
			'fonts.googleapis.com',
			'cdnjs.cloudflare.com'
		],
		fontSrc: [
			"'self'",
			'fonts.googleapis.com',
			'fonts.gstatic.com',
			'cdnjs.cloudflare.com'
		],
		imgSrc: [
			"'self'",
			'data:',
			'www.google-analytics.com',
			'http://*.espncdn.com',
			'placehold.it'
		],
		mediaSrc: [ "'self'" ],
		connectSrc: [ // limit the origins (via XHR, WebSockets, and EventSource)
			"'self'",
		],
		objectSrc: [ "'none'" ],// allows control over Flash and other plugins
		frameSrc: [ 'www.youtube.com' ], // origins that can be embedded as frames
		sandbox: [ 'allow-same-origin', 'allow-forms', 'allow-scripts', 'allow-popups', 'allow-presentation'],
		reportUri: '/report-violation' // error reporting
	}
}))

app.post('/report-violation', function (req, res) {
	if (is_dev) {
		if (req.body) {
			const violation = eval(req.body);
			console.log('Violation:', violation['csp-report']['violated-directive'] + ' - ', violation['csp-report']['blocked-uri'])
		} else {
			console.log('CSP Violation: No data received!')
		}
	}
	res.status(204).end()
})

// Import API Routes
app.use('/api', api)

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}
start()
