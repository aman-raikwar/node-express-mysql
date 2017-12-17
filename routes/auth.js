var express = require('express');
var router = express.Router();

var auth_controller = require('../controllers/auth_controller');

router.get('/sign-in', auth_controller.actionSignIn);
router.post('/sign-in', auth_controller.actionSignInPost);

router.get('/sign-up', auth_controller.actionSignUp);
router.post('/sign-up', auth_controller.actionSignUpPost);

router.get('/forgot-password', auth_controller.actionForgotPassword);
router.post('/forgot-password', auth_controller.actionForgotPasswordPost);

module.exports = router;