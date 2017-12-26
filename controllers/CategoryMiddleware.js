var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var db = require('../config/database.js');
var Category = require('../models/Category');

module.exports = function(req, res, next) {

    req.checkBody('name').notEmpty().withMessage('Name is required').custom(function(value, req) {
        console.log(value);
        if (value != '') {
            var sql = 'SELECT name FROM `tbl_categories` WHERE name = "' + value + '" AND is_deleted=0';
            db.connection.query(sql, function(error, results, fields) {
                if (error) throw error;
                console.log(results, value);
                if (results.length > 0) {
                    console.log(results[0].name);
                    return value === results[0].name;
                } else {
                    return true;
                }
            });
        } else {
            return true;
        }
    }).withMessage('Category already exists');

    req.checkBody('status').notEmpty().withMessage('Status is required');


    var errors = req.validationErrors();
    if (errors) {
        var category = { name: req.body.name, status: req.body.status };
        return res.render('category/create', { category: category, user: req.user, errors: errors });
    } else {
        next();
    }
};