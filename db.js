const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const express = require('express');
const router = express.Router();
module.exports = router;

var db_finish = new Promise(function(resolve, reject){
    let types = ["svg", "fold"]
    let db_origami = {}
    types.forEach(type =>{
        let files = fs.readdirSync("db-origami/" + type);
        let flist = []
        files.forEach(file => {
            let n = path.basename(file, "." + type);
            flist.push({ link: "/db/" + type + "/" + n, name: n });
        });
        db_origami[type] = {link: "/db/" + type, name: type, files: flist};
    });
    resolve(db_origami);
});
module.exports.db_origami = db_finish;

router.get("/", function(req, res){
    db_finish.then((db) => {
        res.render("index.njk", {dropdown_items: Object.values(db)});
    });
});

router.get("/:type", function(req, res){
    var type = req.params.type;
    db_finish.then((db) => {
        res.render("index.njk", {dropdown_items: db[type]['files']});
    });
});

router.get("/:type/:id", function(req, res){
    var id = req.params.id;
    var type = req.params.type;
    fs.readFile("db-origami/" + type + "/" + id + "." + type, 'utf8', function(err, data){
        res.render("index.njk", {script: "/" + type + ".js", data: "`" + data + "`", type: type});
    });
});