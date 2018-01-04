var express = require('express');
var router = express.Router();

var SiteController = require('../../controllers/front/SiteController');

router.get('/', SiteController.index);
router.get('/about', SiteController.about);

router.get('/log-in', SiteController.login);
router.get('/tutor-registration', SiteController.tutorRegistration);
router.get('/student-registration', SiteController.studentRegistration);

module.exports = router;