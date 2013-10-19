var express = require('express'),
    PORT = 8001,
    routes = require('./lib/routes.js');

var app = express();

app.get('/', routes.printOut);
app.get('/User/dropbox/new', routes.createNewDBUser);

console.log('Server is listening on ', PORT)
app.listen(PORT);