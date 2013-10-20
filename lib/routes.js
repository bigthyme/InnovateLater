//All routes definitions live here
  //Author: Anthony Singhavong
var Dropbox = require('dropbox')
    , conf = require('../config/config.js')
    , helpers = require('./helpers.js')
    , url = require('url')
    , request = require('request')
    , PORT = 8001;


exports.hello = function(req, res){
  var body = "hello world";
  res.send(body);
}

exports.logIn = function(req, res){
  var csrfToken = helpers.generateCSRFToken();
  res.cookie('csrf', csrfToken);
  res.redirect(url.format({
    protocol: 'https',
    hostname: 'www.dropbox.com',
    pathname: '1/oauth2/authorize',
    query: {
      client_id: conf.db_api_key,
      response_type: 'code',
      state: csrfToken,
      redirect_uri: helpers.generateRedirectURI(req)
    }
  }));
}

exports.initCallBack = function(req, res){
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
      redirect_uri: helpers.generateRedirectURI(req)
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
      console.log('the token ', token);
      helpers.createClient(conf, Dropbox, body, token, helpers.openDataStore);
      res.send('Saved ' + JSON.parse(body).display_name);
    });
  });
}
