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
app.use('/scripts', express.static(__dirname + '/node_modules/rabbit-ear/'))

const db = require('./db');
app.use('/db', db);
app.use('/edit', require('./edit'))

// add the router
var router = express.Router();
app.set('port', process.env.PORT || 3000);
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
