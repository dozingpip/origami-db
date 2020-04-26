const git = require('nodegit');
const path_to_local = '../db-origami'

var getRemotes = function(repository){
    return git.Remote.list(repository);
};

var fetchAll = function(repository){
    return repository.fetchAll();
};

git.Repository.open(path_to_local)
    .then(getRemotes)
    .then(function(array) {
        console.log(array);
    });
