var express = require('express');
var router = express.Router();

var IndexController = {
    home: function(req, res) {
        res.render('admin/index/home', { layout: 'admin/layouts/layout', user: req.user });
    },
    profile: function(req, res) {
        res.render('admin/index/profile', { layout: 'admin/layouts/layout', user: req.user });
    }
}

module.exports = IndexController;