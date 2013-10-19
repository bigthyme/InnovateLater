//All routes definitions live here
  //Author: Anthony Singhavong
var dropBox = require('dropbox')
    conf = require('../config/config.rb');


exports.printOut = function(req, res){
  var body = "hello world";
  res.setHeader('Content-Type', 'text/plain');
  res.send(body);
}

exports.createNewDBUser = function(req, res, cb){
  debugger;
  var client = new dropBox.Client({
    key: conf.db_api_key,
    secret: conf.db_api_key
  });

  if(cb){
    cb();
  }

  console.log('HERE ', client);
}