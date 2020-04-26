const rabbit = require('rabbit-ear');
const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use('/scripts/rabbit-ear', express.static(__dirname + '/node_modules/rabbit-ear/'));
app.use('/scripts/origami-simulator', express.static(path.resolve(__dirname, "..") + '/OrigamiSimulator'));

const db = require('./db');
app.use('/db', db);
app.use('/edit', require('./edit'));

// add the router
var router = express.Router();
app.set('port', process.env.PORT || 3000);
app.use('/', router);
// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
    res.status(404);
    res.send('404: File Not Found');
});
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
