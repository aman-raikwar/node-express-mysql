var express = require('express');
var router = express.Router();

var SiteController = require('../../controllers/front/SiteController');

router.get('/', SiteController.index);
router.get('/about', SiteController.about);

module.exports = router;