var express = require('express');
var router = express.Router();

var IndexController = {
    home: function(req, res) {
        res.render('index/home', { layout: 'layouts/layout', user: req.user });
    },
    profile: function(req, res) {
        res.render('index/profile', { layout: 'layouts/layout', user: req.user });
    }
}

module.exports = IndexController;