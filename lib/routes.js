//All routes definitions live here
  //Author: Anthony Singhavong
var Dropbox = require('dropbox')
    , conf = require('../config/config.js');
    // , DBhelpers = require('./db-helpers.js');


exports.printOut = function(req, res){
  var body = "hello world";
  res.setHeader('Content-Type', 'text/plain');
  res.send(body);
}

exports.createNewDBUser = function(req, res){
  console.log(conf);

  var dbClient = new Dropbox.Client({
    key: conf.db_api_key,
    secret: conf.db_api_key
  });

  dbClient.authDriver(new Dropbox.AuthDriver.NodeServer(8001));

  dbClient.authenticate(function(error, client) {
    console.log('connected...');
    console.log('token ', client.oauth.token);       // THE_TOKEN
    console.log('secret', client.oauth.tokenSecret); // THE_TOKEN_SECRET
  });

  console.log('HERE ', client);
}
