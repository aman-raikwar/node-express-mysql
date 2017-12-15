var express = require('express');
var router = express.Router();

var index_controller = {
    home: function(req, res) {
        res.render('index', { layout: 'layouts/layout' });
    },
    about: function(req, res) {
        res.render('index/about', { layout: 'layouts/layout' });
    }
}

module.exports = index_controller;