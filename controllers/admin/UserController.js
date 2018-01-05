var fs = require('fs');
var User = require('../../models/User');
var commonHelper = require('../../helper/common_helper.js');

var UserController = {

    actionIndex: function(req, res, next) {
        var limit = 10;
        var total = 0;
        var page = parseInt(req.query.page) || 1;
        var offset = (limit * page) - limit;
        var role_id = req.body.role_id;

        var orderParams;
        if (typeof req.query.orderColumn != 'undefined' && req.query.orderColumn != '' && typeof req.query.orderBy != 'undefined' && req.query.orderBy != '') {
            orderParams = {
                orderColumn: req.query.orderColumn,
                orderBy: req.query.orderBy
            };
        }

        var searchParams = {
            id: req.query.id,
            name: req.query.name,
            status: req.query.status,
            role_id: role_id
        };

        if (role_id == 0) {
            searchParams.role_id = req.query.role;
        }

        User.countUser(searchParams).then(function(result) {
            total = result[0].total;

            User.getUsers(limit, offset, searchParams, orderParams).then(function(result) {
                res.render('admin/user/index', {
                    title: req.body.title,
                    role: role_id,
                    users: result,
                    current: page,
                    pages: Math.ceil(total / limit),
                    params: req.query,
                    user: req.user
                });
            });
        });
    },

    actionShow: function(req, res, next) {
        var id = req.params.id;
        var message = "Unable to show the Record!";

        if (typeof id != 'undefined' && id != '') {
            User.singleUser(id).then(function(result) {
                if (typeof result != 'undefined' && result != '') {
                    console.log(result);
                    res.render('admin/user/show', { singleUser: result, params: req.body, user: req.user });
                } else {
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.redirect('/admin/users/');
                }
            }).catch(function(error) {
                req.flash('type', 'danger');
                req.flash('message', message);
                res.redirect('/admin/users/');
            });
        } else {
            req.flash('type', 'danger');
            req.flash('message', message);
            res.redirect('/admin/users/');
        }
    },

    actionCreate: function(req, res, next) {
        req.flash('type', '');
        req.flash('message', '');
        res.render('admin/user/create', { params: req.body, user: req.user });
    },

    actionStore: function(req, res, next) {
        var message = "";

        req.checkBody('username', 'Username is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            message = "Please enter Username";
            req.flash('type', 'danger');
            req.flash('message', message);
            res.render('admin/user/create', { params: req.body, user: req.user });
        } else {
            User.checkUsernameExists(req.body.name).then(function(result) {
                if (result.length > 0) {
                    message = "User with '<b>" + req.body.name + "</b>' already exists!";
                    req.flash('type', 'danger');
                    req.flash('message', message);
                    res.render('admin/user/create', { params: req.body, user: req.user });
                } else {
                    var currentDate = commonHelper.getCurrentDateTime();
                    var user = { username: req.body.username, created_at: currentDate };
                    User.addUser(user).then(function(result) {
                        message = "User added successfully!";
                        req.flash('type', 'success');
                        req.flash('message', message);
                        res.redirect('/admin/users/');
                    }).catch(function(error) {
                        message = "Unable to add new User!";
                        req.flash('type', 'danger');
                        req.flash('message', message);
                        res.render('admin/user/create', { params: req.body, user: req.user });
                    });
                }
            });
        }
    },

}

module.exports = UserController;