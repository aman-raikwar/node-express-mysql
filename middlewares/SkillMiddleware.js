var express = require('express');
var router = express.Router();

module.exports = function(req, res, next) {

    req.checkBody('category_id').notEmpty().withMessage('Category is required');
    req.checkBody('name').notEmpty().withMessage('Name is required');
    req.checkBody('status').notEmpty().withMessage('Status is required');

    var errors = req.validationErrors();
    if (errors) {
        var skill = { category_id: req.body.category_id, name: req.body.name, status: req.body.status };
        var skill_id = req.params.skill_id;
        var template = 'skill/create';
        if (typeof skill_id != 'undefined' && skill_id != '') {
            skill.id = skill_id;
            template = 'skill/edit';
        }

        return res.render(template, { skill: skill, user: req.user, errors: errors });
    } else {
        next();
    }

};