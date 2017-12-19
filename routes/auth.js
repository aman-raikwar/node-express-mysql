var express = require('express');
var router = express.Router();
var passport = require('passport');

var auth_controller = require('../controllers/auth_controller');

router.use(function(req, res, next) {
    res.locals.layout = "layouts/layoutAuth";
    next();
});

router.get('/sign-in', auth_controller.actionSignIn);
router.post('/sign-in', auth_controller.actionSignInPost);

router.get('/sign-up', auth_controller.actionSignUp);
router.post('/sign-up', passport.authenticate('local'), auth_controller.actionSignUpPost);

router.get('/forgot-password', auth_controller.actionForgotPassword);
router.post('/forgot-password', auth_controller.actionForgotPasswordPost);

router.get('/sign-out', auth_controller.actionLogout);

module.exports = router;