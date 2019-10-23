const rabbit = require('rabbit-ear');
const express = require('express');
const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

var app = express();
app.use(express.static(path.join(__dirname, 'public')))
nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.use('/scripts', express.static(__dirname + '/node_modules/rabbit-ear/'))

fs.readFile("crane.svg", 'utf8', function(err, data){
    d = data;
});

app.get("/", function(req, res){
    res.render("index.njk", {script: "highlight.js", data: "`" + d + "`"});
});

// add the router
var router = express.Router();
app.set('port', process.env.PORT || 3000);
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
