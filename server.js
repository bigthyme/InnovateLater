var crypto = require('crypto')
	,	express = require('express')
	,	request = require('request')
	,	url = require('url')
	,	conf = require('./config/config.js');

var app = express();
app.use(express.cookieParser());

// insert your app key and secret here
var APP_KEY = conf.db_api_key;
var APP_SECRET = conf.db_api_secret;

function generateCSRFToken() {
	return crypto.randomBytes(18).toString('base64')
		.replace(/\//g, '-').replace(/\+/g, '_');
}

function generateRedirectURI(req) {
	return url.format({
			protocol: req.protocol,
			host: req.headers.host,
			pathname: app.path() + '/callback'
	});
}

app.get('/', function (req, res) {
	var csrfToken = generateCSRFToken();
	res.cookie('csrf', csrfToken);
	res.redirect(url.format({
		protocol: 'https',
		hostname: 'www.dropbox.com',
		pathname: '1/oauth2/authorize',
		query: {
			client_id: conf.db_api_key,
			response_type: 'code',
			state: csrfToken,
			redirect_uri: generateRedirectURI(req)
		}
	}));
});

app.get('/callback', function (req, res) {

	console.log('hello?');

	if (req.query.error) {
		return res.send('ERROR ' + req.query.error + ': ' + req.query.error_description);
	}

	// check CSRF token
	if (req.query.state !== req.cookies.csrf) {
		return res.status(401).send(
			'CSRF token mismatch, possible cross-site request forgery attempt.'
		);
	}
	// exchange access code for bearer token
	request.post('https://api.dropbox.com/1/oauth2/token', {
		form: {
			code: req.query.code,
			grant_type: 'authorization_code',
			redirect_uri: generateRedirectURI(req)
		},
		auth: {
			user: conf.db_api_key,
			pass: conf.db_api_secret
		}
	}, function (error, response, body) {
		var data = JSON.parse(body);

		if (data.error) {
			return res.send('ERROR: ' + data.error);
		}

		// extract bearer token
		var token = data.access_token;

		// use the bearer token to make API calls
		request.get('https://api.dropbox.com/1/account/info', {
			headers: { Authorization: 'Bearer ' + token }
		}, function (error, response, body) {
			res.send('Logged in successfully as ' + JSON.parse(body).display_name + '.');
		});
	});
});

app.listen(5000);