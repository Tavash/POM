var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var Project = require('../models/Project.js');

router.get('/', getAllProjects);
router.post('/', createProject);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);
//router.get('/:id/tasks', getProjectsCollaborator);


/* GET projects listing. */
function getAllProjects(req, res, next) {
    Project.find(function (err, projects) {
        if (err)
			return next(err);
        res.json(projects);
        
   	});
};

/* GET project collaborator tasks. */
/*
function getProjectsCollaboratorTasks(req, res, next) {
    Project.find({
            "collaborateurs":req.params.id
        },
        function (err, collaborators) {
            if (err)
                return next(err);
            res.json(collaborators);
        });
};
*/

/* POST /projects */
function createProject(req, res, next) {
  Project.create(req.body, function (err) {
      if (err)
          return next(err);
      res.json(req.body);
  });
};

/* GET /projects/id */
function getProjectById(req, res, next) {
  Project.findById(req.params.id, function (err, projects) {
    if (err) 
    	return next(err);
    res.json(projects);
  });
};

/* PUT /projects/:id */
function updateProject(req, res, next) {
  Project.findByIdAndUpdate(req.params.id, req.body, function (err, projects) {
    if (err) 
    	return next(err);
    res.json(projects);
  });
};

/* DELETE /projects/:id */
function deleteProject(req, res, next) {
  Project.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) 
    	return next(err);
    res.json(post);
  });
};

/* GET collaborators tasks listing. */
/*router.delete('/:id', function(req, res, next) {
function getTasksCollaborator(req, res, next) {
    Project.find({
            "taches.collaborateurs":req.params.id
        },
        function (err, collaborators) {
            if (err)
                return next(err);
            res.json(collaborators);
        });
};
*/

module.exports = router;
