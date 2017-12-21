var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth_controller = require('../controllers/auth_controller');

router.use(function(req, res, next) {
    res.locals.layout = "layouts/layoutAuth";
    console.log(req.isAuthenticated());
    next();
});

// route middleware to make sure
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the sign-in page
    res.redirect('/auth/sign-in');
}

// router.all('/', isLoggedIn, function(req, res, next) {
//     next();
// });

router.get('/sign-in', auth_controller.actionSignIn);
//router.post('/sign-in', auth_controller.actionSignInPost);

router.post('/sign-in', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/auth/sign-in', failureFlash: true }), function(req, res) {
    console.log("hello");

    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.redirect('/');
});

router.get('/sign-up', auth_controller.actionSignUp);
//router.post('/sign-up', passport.authenticate('local'), auth_controller.actionSignUpPost);
router.post('/sign-up', passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/auth/sign-up', failureFlash: true }));

router.get('/forgot-password', auth_controller.actionForgotPassword);
router.post('/forgot-password', auth_controller.actionForgotPasswordPost);

router.get('/sign-out', auth_controller.actionLogout);

module.exports = router;