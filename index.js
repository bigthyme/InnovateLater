var express = require('express')
  , PORT = 8001
  , routes = require('./lib/routes.js');

var app = express();
app.use(express.cookieParser());

app.get('/', routes.logIn);
app.get('/callback', routes.initCallBack);
// app.get('/User/save', routes.addUserToDB);

console.log('Server is listening on ', PORT)
app.listen(PORT);