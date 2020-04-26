const fs = require('fs');
const path = require('path');
const express = require('express');
const git = require("nodegit");
const router = express.Router();
module.exports = router;
let registered_dbs = {};
clone_and_index( "https://github.com/freestraws/db-origami").catch(r=>{console.log(r);});
async function clone_and_index(link, name=null, db_loc=null, local=false){
    if(name == null) name = path.basename(link);
    if(name in registered_dbs && "db_promise" in registered_dbs[name]) return;
    if(db_loc == null) db_loc = "./tmp/" + name + "/";
    registered_dbs[name] = {"loc": db_loc, "link": link};
    registered_dbs[name].db_clone = new Promise(function(resolve, reject){
        if(!fs.existsSync(db_loc)){
            if(!local){
                console.log("cloning");
                const repo = git.Clone(link, "./tmp/" + name);
                repo.catch(_=>{reject("bad link?");});
                repo.then(_=>{console.log("done cloning");resolve();});
            } else reject("local db doesn't exist");
        }
        console.log("don't need to clone");
        resolve();
    });
    registered_dbs[name].db_clone.then(_=>registered_dbs[name].db_promise = get_db(db_loc));
}
module.exports.clone_and_index = clone_and_index;

function get_db(db_loc){
    if(fs.existsSync(db_loc + "contents.json")){
        return new Promise((resolve, reject) =>resolve(JSON.parse(fs.readFileSync(db_loc + "contents.json"))));
    }
    return new Promise((resolve, reject)=>{
        let db_origami = {};
        let model_names = fs.readdirSync(db_loc);
        model_names.forEach(name =>{
            db_origami[name] = {};
            let files = fs.readdirSync(db_loc + name);
            files.forEach(file => {
                let type = path.extname(file).split('.').pop();
                if(!(type in db_origami[name])) db_origami[name][type] = [];
                db_origami[name][type].push(file);
            });
        });
        resolve(db_origami);
    });
}

function link(link, res){
    if("?" in link) link = link.replace("?", "/");
    clone_and_index(link).catch(r=>{console.log(r);res.status(404).send('Not found');});
}

router.get("/:db", function(req, res){
    let db_name = req.params.db;
    if(!(db_name in registered_dbs)) res.status(404).send('db not found');
    let db_promise = registered_dbs[db_name].db_promise;
    db_promise.then((db) => {
        res.render("viewer.njk", {plink:"/db/" + db_name +"/", dropdown_items: Object.keys(db)});
    });
});

router.get("/:db/:id", function(req, res){
    let db_promise = registered_dbs[req.params.db].db_promise;
    let id = req.params.id;
    console.log(id);
    db_promise.then((db) => {
        if(id in db){
            res.render("viewer.njk", {plink: db[id].name + "/", dropdown_items: db[id].files});
        }
    });
});

router.get("/:db/:id/:file", function(req, res){
    let db = registered_dbs[req.params.db];
    let id = req.params.id;
    let file = req.params.file;
    let type = path.extname(file).split('.').pop();
    db.db_clone.then( _ => {
        fs.readFile(db.loc + id + "/" + file, 'utf8', function(err, data){
            res.render("viewer.njk", {script: "/" + type + ".js", data: "`" + data + "`", type: type});
        });
    });
});