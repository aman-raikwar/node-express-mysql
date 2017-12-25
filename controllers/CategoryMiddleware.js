var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var db = require('../config/database.js');
var Category = require('../models/Category');

module.exports = function(req, res, next) {

    req.checkBody('name').withMessage('Name is required');
    req.checkBody('name', 'Category is already exist').custom(req.body.name, function(req) {
        //const db = require('../db');
        db.connection.query('SELECT name FROM `tbl_categories` WHERE name = "' + req.body.name + '"', function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                return value !== results[0].name;
            };
        });
    });

    req.checkBody('status').withMessage('Status is required');

    var errors = req.validationErrors();
    if (errors) {
        var category = { name: req.body.name, status: req.body.status };
        return res.render('category/create', { category: category, user: req.user, errors: errors });
    } else {
        next();
    }
};