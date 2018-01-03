var express = require('express');
var router = express.Router();

var SiteController = {
    index: function(req, res) {
        res.render('front/site/index');
    },
    about: function(req, res) {
        res.render('front/site/about');
    }
}

module.exports = SiteController;