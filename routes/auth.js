var express = require('express');
var router = express.Router();
var passport = require('passport');

var AuthController = require('../controllers/AuthController');

router.use(function(req, res, next) {
    res.locals.layout = "layouts/layoutAuth";
    //console.log(req.isAuthenticated());
    next();
});

// route middleware to make sure
// function isLoggedIn(req, res, next) {
//     // if user is authenticated in the session, carry on
//     console.log(req.isAuthenticated());
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the sign-in page
//     res.redirect('/auth/sign-in');
// }

// router.all('/', isLoggedIn, function(req, res, next) {
//     next();
// });

router.get('/sign-in', AuthController.actionSignIn);
router.post('/sign-in', passport.authenticate('local-login', { failureRedirect: '/auth/sign-in', failureFlash: true }), function(req, res) {
    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3;
    } else {
        req.session.cookie.expires = false;
    }
    res.redirect('/');
});

router.get('/sign-up', AuthController.actionSignUp);
router.post('/sign-up', passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/auth/sign-up', failureFlash: true }));

router.get('/forgot-password', AuthController.actionForgotPassword);
router.post('/forgot-password', AuthController.actionForgotPasswordPost);

router.get('/sign-out', AuthController.actionLogout);

module.exports = router;