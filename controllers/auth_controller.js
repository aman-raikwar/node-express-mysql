var fs = require('fs');
var authModel = require('../models/auth_model.js');

var auth_controller = {

    actionSignIn: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('auth/sign-in', { response: response, params: params });
    },

    actionSignInPost: function(req, res, next) {
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