var fs = require('fs');
var md5 = require('md5');
var authModel = require('../models/auth_model.js');

var auth_controller = {

    actionSignIn: function(req, res, next) {
        var params = req.body;
        req.flash('icon', '');
        req.flash('type', '');
        req.flash('message', '');
        res.render('auth/sign-in', { params: params });
    },

    actionSignInPost: function(req, res, next) {
        var message = "";

        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            message = "";
            req.flash('icon', 'error');
            req.flash('type', 'danger');
            req.flash('message', message);
            res.render('auth/sign-in', { params: req.body });
        } else {

            var data = {
                username: req.body.username,
                password: req.body.password
            };

            authModel.getUserBy(data).then(function(result) {
                if (typeof result == 'undefined') {
                    message = "Invalid Username and Password!";
                    req.flash('type', 'danger');
                    req.flash('icon', 'error');
                    req.flash('message', message);
                    res.render('auth/sign-in', { params: req.body });
                } else if (!result.is_email_verified) {
                    message = "Your email address is not verified yet!";
                    req.flash('type', 'danger');
                    req.flash('icon', 'error');
                    req.flash('message', message);
                    res.render('auth/sign-in', { params: req.body });
                } else if (md5(data.password) != result.password) {
                    message = "Incorrect Password!";
                    req.flash('type', 'danger');
                    req.flash('icon', 'error');
                    req.flash('message', message);
                    res.render('auth/sign-in', { params: req.body });
                } else {
                    if (req.body.remember) {
                        req.session.cookie.maxAge = 1000 * 60 * 3;
                    } else {
                        req.session.cookie.expires = false;
                    }
                    userInfo = authModel.setUserInfo(result);
                    // token = passportService.generateToken(userInfo);
                    token = "aman";
                    res.cookie('authorization', token);
                    res.cookie('userInfo', userInfo);
                    req.session.cookie.userInfo = userInfo;
                    res.redirect('/');
                }
            }).catch(function(error) {
                console.log(error);
                message = "Unable to Sign In User!";
                req.flash('type', 'danger');
                req.flash('icon', 'error');
                req.flash('message', message);
                res.render('auth/sign-in', { params: req.body });
            });
        }
    },

    actionSignUp: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('auth/sign-up', { response: response, params: params });
    },

    actionSignUpPost: function(req, res, next) {
        var response = { success: false, msg: "" };

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            response.msg = "Please enter category name";
            res.render('category/create', { response: response, params: req.body });
        } else {
            categoryModel.checkCategoryExists(req.body.name).then(function(result) {
                if (result.length > 0) {
                    response.msg = "Category '<b>" + req.body.name + "</b>' already exists!";
                    res.render('category/create', { response: response, params: req.body });
                } else {
                    var currentDate = auth_controller.getCuurentDate();
                    var category = { name: req.body.name, created_at: currentDate };
                    categoryModel.addCategory(category).then(function(result) {
                        response.success = true;
                        response.msg = "Category added successfully!";
                        res.redirect('/category/');
                    }).catch(function(error) {
                        response.msg = "Unable to add new Category!";
                        res.render('category/create', { response: response, params: req.body });
                    });
                }
            });
        }
    },

    actionForgotPassword: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('auth/forgot-password', { response: response, params: params });
    },

    actionForgotPasswordPost: function(req, res, next) {
        var response = { success: false, msg: "" };

        req.checkBody('name', 'Category name is required').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            response.msg = "Please enter category name";
            res.render('category/create', { response: response, params: req.body });
        } else {
            categoryModel.checkCategoryExists(req.body.name).then(function(result) {
                if (result.length > 0) {
                    response.msg = "Category '<b>" + req.body.name + "</b>' already exists!";
                    res.render('category/create', { response: response, params: req.body });
                } else {
                    var currentDate = auth_controller.getCuurentDate();
                    var category = { name: req.body.name, created_at: currentDate };
                    categoryModel.addCategory(category).then(function(result) {
                        response.success = true;
                        response.msg = "Category added successfully!";
                        res.redirect('/category/');
                    }).catch(function(error) {
                        response.msg = "Unable to add new Category!";
                        res.render('category/create', { response: response, params: req.body });
                    });
                }
            });
        }
    },

    actionLogout: function(req, res) {
        req.logOut();
        req.session.destroy(function(err) {
            req.session = null;
            res.clearCookie('authorization');
            res.clearCookie('userInfo');
            res.redirect('/auth/sign-in');
        });
    },

    getCurrentDate: function() {
        var date = new Date();
        var curmonth = (date.getMonth() + 1);
        if (curmonth < 10)
            curmonth = "0" + curmonth;
        var curDate = date.getDate();
        if (curDate < 10)
            curDate = "0" + curDate;
        var dbdate = date.getFullYear() + "-" + curmonth + "-" + curDate + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        return dbdate;
    }

}

module.exports = auth_controller;