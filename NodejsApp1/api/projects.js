var db = require('./mongo');

exports.all = function(req,res) {
    res.send(['ploppy', 'floppy', 'boppy']);
}

exports.findById = function(req, res) {
    var id = req.params.id;
    var found = db.projectById(id);
    res.send({id:req.params.id, project: found});
}

exports.addProject = function(req, res) {
    res.send({id:req.params.id, name:'ploppy'});
}

exports.updateProject = function(req, res) {
    res.send({id:req.params.id, name:'ploppy'});
}

exports.deleteProject = function(req, res) {
    res.send({id:req.params.id, name:'ploppy'});
}