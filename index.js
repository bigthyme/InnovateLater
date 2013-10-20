var express = require('express')
  , PORT = process.env.PORT || 8001
  , routes = require('./lib/routes.js');

var app = express();
app.use(express.cookieParser());

app.get('/', routes.hello)
app.get('/dropbox/login', routes.logIn);
app.get('/user/save', routes.initCallBack);

console.log('Server is listening on ', PORT)
app.listen(PORT);