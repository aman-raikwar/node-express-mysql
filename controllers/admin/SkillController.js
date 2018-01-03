var fs = require('fs');
var Skill = require('../models/Skill');
var commonHelper = require('../helper/common_helper.js');

var SkillController = {

    actionIndex: function(req, res, next) {
        var limit = 10;
        var total = 0;
        var page = parseInt(req.query.page) || 1;
        var offset = (limit * page) - limit;

        var orderParams;
        if (typeof req.query.orderColumn != 'undefined' && req.query.orderColumn != '' && typeof req.query.orderBy != 'undefined' && req.query.orderBy != '') {
            orderParams = {
                orderColumn: req.query.orderColumn,
                orderBy: req.query.orderBy
            };
        }

        var searchParams = {
            id: req.query.id,
            category: req.query.category,
            name: req.query.name,
            status: req.query.status
        };

        Skill.countSkill(searchParams).then(function(result) {
            console.log(result);
            total = result[0].total;

            Skill.getSkills(limit, offset, searchParams, orderParams).then(function(result) {
                res.render('skill/index', {
                    skills: result,
                    current: page,
                    pages: Math.ceil(total / limit),
                    params: req.query,
                    user: req.user
                });
            });
        });
    },

    actionShow: function(req, res, next) {
        var skill_id = req.params.skill_id;
        var message = "Unable to show the Record!";

        if (typeof skill_id != 'undefined' && skill_id != '') {
            Skill.singleSkill(skill_id).then(function(result) {
                if (typeof result != 'undefined' && result != '') {
                    res.render('skill/show', { skill: result, user: req.user });
                } else {
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.redirect('/skill/');
                }
            }).catch(function(error) {
                req.flash('type', 'danger');
                req.flash('message', message);
                res.redirect('/skill/');
            });
        } else {
            req.flash('type', 'danger');
            req.flash('message', message);
            res.redirect('/skill/');
        }
    },

    actionCreate: function(req, res, next) {
        var skill = { category_id: '', name: '', status: '' };
        res.render('skill/create', { skill: skill, user: req.user });
    },

    actionStore: function(req, res, next) {
        var currentDate = commonHelper.getCurrentDateTime();
        var skill = { category_id: req.body.category_id, name: req.body.name, status: parseInt(req.body.status), created_at: currentDate };
        Skill.checkSkillExists(skill.name).then(function(result) {
            if (result.length > 0) {
                req.flash('type', 'danger');
                req.flash('message', "Skill '<b>" + req.body.name + "</b>' already exists!");
                res.render('skill/create', { skill: skill, user: req.user });
            } else {
                Skill.addSkill(skill).then(function(result) {
                    req.flash('type', 'success');
                    req.flash('message', "Skill added successfully!");
                    res.redirect('/skill/');
                }).catch(function(error) {
                    req.flash('type', 'danger');
                    req.flash('message', "Unable to add new Skill!");
                    res.render('skill/create', { skill: skill, user: req.user });
                });
            }
        });
    },

    actionEdit: function(req, res, next) {
        var skill_id = req.params.skill_id;

        if (typeof skill_id != 'undefined' && skill_id != '') {
            Skill.singleSkill(skill_id).then(function(result) {
                res.render('skill/edit', { skill: result, user: req.user });
            });
        } else {
            req.flash('type', 'danger');
            req.flash('message', 'Unable to edit Skill!');
            res.redirect('/skill/');
        }
    },

    actionUpdate: function(req, res, next) {
        var skill_id = req.params.skill_id;
        var currentDate = commonHelper.getCurrentDateTime();
        var skill = { category_id: req.body.category_id, name: req.body.name, status: req.body.status, updated_at: currentDate };

        Skill.checkSkillExists(req.body.name, skill_id).then(function(result) {
            if (result.length > 0) {
                req.flash('type', 'danger');
                req.flash('message', "Skill '<b>" + req.body.name + "</b>' already exists!");
                res.render('skill/edit', { skill: skill, user: req.user });
            } else {
                Skill.updateSkill(skill, skill_id).then(function(result) {
                    req.flash('type', 'success');
                    req.flash('message', "Skill updated successfully!");
                    res.redirect('/skill/');
                }).catch(function(error) {
                    req.flash('type', 'danger');
                    req.flash('message', "Unable to update Skill!");
                    res.render('skill/edit', { skill: skill, user: req.user });
                });
            }
        });
    },

    actionDelete: function(req, res, next) {
        var response = { success: false, msg: "Unable to delete this Skill!" };
        var skill_id = req.params.skill_id;

        Skill.deleteSkill(skill_id).then(function(result) {
            if (result) {
                response = { success: true, msg: "Your skill record has been deleted." };
            }
            res.json(response);
        }).catch(function(error) {
            res.json(response);
        });
    }

}

module.exports = SkillController;