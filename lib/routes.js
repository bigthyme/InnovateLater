//All routes definitions live here
  //Author: Anthony Singhavong
var Dropbox = require('dropbox')
    , conf = require('../config/config.js')
    , helper = require('./helpers.js')
    , url = require('url')
    , request = require('request')
    , PORT = 8001;


exports.printOut = function(req, res){
  var body = "hello world";
  res.send(body);
}

exports.logIn = function(req, res){
  var csrfToken = helper.generateCSRFToken();
  res.cookie('csrf', csrfToken);
  res.redirect(url.format({
    protocol: 'https',
    hostname: 'www.dropbox.com',
    pathname: '1/oauth2/authorize',
    query: {
      client_id: conf.db_api_key,
      response_type: 'code',
      state: csrfToken,
      redirect_uri: helper.generateRedirectURI(req)
    }
  }));
}

exports.initCallback = function(req, res){
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
      redirect_uri: helper.generateRedirectURI(req)
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
      console.log(JSON.parse(body));
      res.send('OBJECT ' + JSON.parse(body).display_name);
    });
  });
}

exports.createNewDBUser = function(req, res){

  var dbClient = new Dropbox.Client({
    key: conf.db_api_key,
    secret: conf.db_api_key
  });

  dbClient.authDriver(new Dropbox.AuthDriver.NodeServer(PORT));

  dbClient.authenticate(function(error) {
    if (error) {
      console.log(error);
    }
  });
}
