var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/category_controller');

router.get('/', categoryController.actionIndex);

router.get('/show/:category_id', categoryController.actionShow);

router.get('/create', categoryController.actionCreate);
router.post('/create', categoryController.actionStore);

router.get('/edit/:category_id', categoryController.actionEdit);
router.post('/edit/:category_id', categoryController.actionUpdate);

router.delete('/delete/:category_id', categoryController.actionDelete);

router.get('/fake-data', categoryController.actionFakeData);

module.exports = router;