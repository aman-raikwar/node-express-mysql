var fs = require('fs');
var md5 = require('md5');
var Auth = require('../../models/Auth');

var AuthController = {

    actionSignIn: function(req, res, next) {
        var params = req.body;
        req.flash('type', '');
        req.flash('message', '');
        res.render('admin/auth/sign-in', { params: params, message: req.flash('loginMessage') });
    },

    actionSignUp: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('admin/auth/sign-up', { response: response, params: params, message: req.flash('signupMessage') });
    },

    actionForgotPassword: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('admin/auth/forgot-password', { response: response, params: params });
    },

    actionForgotPasswordPost: function(req, res, next) {
        var response = { success: false, msg: "" };
        var params = req.body;
        res.render('admin/auth/forgot-password', { response: response, params: params });
    },

    actionLogout: function(req, res) {
        req.logOut();
        req.session.destroy(function(err) {
            req.session = null;
            res.clearCookie('authorization');
            res.clearCookie('userInfo');
            res.redirect('/admin/auth/sign-in');
        });
    }

}

module.exports = AuthController;