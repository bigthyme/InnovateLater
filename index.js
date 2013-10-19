var express = require('express')
  , PORT = 8001
  , routes = require('./lib/routes.js');

var app = express();
app.use(express.cookieParser());

app.get('/', routes.logIn);
app.get('/callback', routes.initCallback);
app.get('/User/dropbox/new', routes.createNewDBUser);

console.log('Server is listening on ', PORT)
app.listen(PORT);