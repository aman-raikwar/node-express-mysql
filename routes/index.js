var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index_controller');

router.get('/', index_controller.home);
router.get('/about', index_controller.about);

module.exports = router;