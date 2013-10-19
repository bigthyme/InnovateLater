var request = require('request')
  , crypto = require('crypto')
  , url = require('url')
  , express = require('express')
  , app = express();

exports.generateCSRFToken = function() {
  return crypto.randomBytes(18).toString('base64')
    .replace(/\//g, '-').replace(/\+/g, '_');
}

exports.generateRedirectURI = function(req) {
  return url.format({
      protocol: req.protocol,
      host: req.headers.host,
      pathname: app.path() + '/callback'
  });
}
