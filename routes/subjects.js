var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Subject = require('../models/Subject.js');

/* GET LIST OF SUBJECTS */
router.get('/', function(req, res, next) {

    var title = 'Owl tutoring Web APIs - List of Subjects';
    var subjects = [];

    Subject.find(function(err, subjects) {
        if (err) return next(err);
        res.render('subjects/index', { title: title, subjects: subjects });
    });

});

/* ADD SUBJECT */
router.get('/create', function(req, res, next) {
    var title = 'Owl tutoring Web APIs - Add Subject';
    res.render('subjects/create', { title: title });
});

/* ADD SUBJECT */
router.post('/create', function(req, res, next) {
    Subject.create(req.body, function(err, post) {
        if (err) return next(err);
    });
});

// route middleware to validate :name
router.param('id', function(req, res, next, name) {
    // do validation on name here
    // blah blah validation
    // log something so we know its working
    console.log('doing name validations on ' + id);

    // once validation is done save the new item in the req
    req._id = id;
    // go to the next thing
    next();
});

router.get('/edit/:id', function(req, res) {
    var title = 'Owl tutoring Web APIs - Edit Subject';

    if (req._id) {
        res.render('subjects/edit', { title: title });
    }
});

module.exports = router;