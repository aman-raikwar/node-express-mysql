var express = require('express');
var router = express.Router();

var IndexController = require('../../controllers/admin/IndexController');

router.get('/', IndexController.home);
router.get('/profile', IndexController.profile);

module.exports = router;