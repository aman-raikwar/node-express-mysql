var express = require('express');
var router = express.Router();

module.exports = function(req, res, next) {

    req.checkBody('name').notEmpty().withMessage('Name is required');
    req.checkBody('status').notEmpty().withMessage('Status is required');

    var errors = req.validationErrors();
    if (errors) {
        var category = { name: req.body.name, status: req.body.status };
        var category_id = req.params.category_id;
        var template = 'category/create';
        if (typeof category_id != 'undefined' && category_id != '') {
            category.id = category_id;
            template = 'category/edit';
        }

        return res.render(template, { category: category, user: req.user, errors: errors });
    } else {
        next();
    }

};