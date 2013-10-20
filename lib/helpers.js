var request = require('request')
  , crypto = require('crypto')
  , url = require('url')
  , express = require('express')
  , dsDropbox = require('./dropbox-datastore.js')
  , app = express();

exports.generateCSRFToken = function() {
  return crypto.randomBytes(18).toString('base64')
    .replace(/\//g, '-').replace(/\+/g, '_');
}

exports.generateRedirectURI = function(req) {
  console.log('Protocall is set to... ', req.protocol);
  return url.format({
      protocol: req.protocol,
      host: req.headers.host,
      pathname: app.path() + '/user/save'
  });
}

exports.createClient = function(api_config, dropbox, respBody, api_token, cb){
  var responseBody = JSON.parse(respBody);

  var dbClient = new dsDropbox.Client({
    key: api_config.db_api_key,
    secret: api_config.db_secret,
    token: api_token,
    uuid: responseBody.uuid
  });

  if(dbClient.isAuthenticated()){
    console.log('User is being authenticated...');
  }
  if(cb){
    console.log('Opening up dropbox datastore...');
    cb(dbClient, respBody)
  }
}

exports.openDataStore = function(client, respBody){
  var userTable
    , userInfo;

  client.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
    if (error) {
        alert('Error opening default datastore: ' + error);
    }

    userTable = datastore.getTable('users');
    userInfo = userTable.insert({
      username: JSON.parse(respBody).display_name,
      created: new Date()
    });
    console.log(userInfo.get('username'));
  });
}
