const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const express = require('express');
const router = express.Router();
module.exports = router;

let db_finish = new Promise(function(resolve, reject){
    let db_origami = {}
    let model_names = fs.readdirSync("db-origami/db/");
    model_names.forEach(name =>{
        let flist = []
        let files = fs.readdirSync("db-origami/db/" + name);
        files.forEach(file => {
            let type = path.extname(file).split('.').pop();
            flist.push({ link: "/db/" + name + "/" + type, name: type });
        });
        db_origami[name] = {link: "/db/" + name, name: name, files: flist};
    });
    resolve(db_origami);
});
module.exports.db_origami = db_finish;

router.get("/", function(req, res){
    db_finish.then((db) => {
        res.render("viewer.njk", {dropdown_items: Object.values(db)});
    });
});

router.get("/:id", function(req, res){
    let id = req.params.id;
    db_finish.then((db) => {
        res.render("viewer.njk", {dropdown_items: db[id]['files']});
    });
});

router.get("/:id/:type", function(req, res){
    let id = req.params.id;
    let type = req.params.type;
    fs.readFile("db-origami/db/" + id + "/" + id + "." + type, 'utf8', function(err, data){
        res.render("viewer.njk", {script: "/" + type + ".js", data: "`" + data + "`", type: type});
    });
});