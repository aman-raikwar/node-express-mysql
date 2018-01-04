var express = require('express');
var router = express.Router();

var SiteController = {
    index: function(req, res) {
        res.render('front/site/index');
    },
    about: function(req, res) {
        res.render('front/site/about');
    },
    login: function(req, res) {
        res.render('front/site/login');
    },
    tutorRegistration: function(req, res) {
        res.render('front/site/tutor-registration');
    },
    studentRegistration: function(req, res) {
        res.render('front/site/student-registration');
    }
}

module.exports = SiteController;