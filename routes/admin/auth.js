var express = require('express');
var router = express.Router();
var passport = require('passport');

var AuthController = require('../../controllers/admin/AuthController');

router.use(function(req, res, next) {
    res.locals.layout = "admin/layouts/layoutAuth";
    //console.log(req.isAuthenticated());
    next();
});

router.get('/sign-in', AuthController.actionSignIn);
router.post('/sign-in', passport.authenticate('local-login', {
    failureRedirect: '/admin/auth/sign-in',
    failureFlash: true
}), function(req, res) {
    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.redirect('/admin/');
});

router.get('/sign-up', AuthController.actionSignUp);
router.post('/sign-up', passport.authenticate('local-signup', {
    successRedirect: '/admin/',
    failureRedirect: '/admin/auth/sign-up',
    failureFlash: true
}));

router.get('/forgot-password', AuthController.actionForgotPassword);
router.post('/forgot-password', AuthController.actionForgotPasswordPost);

router.get('/sign-out', AuthController.actionLogout);

module.exports = router;