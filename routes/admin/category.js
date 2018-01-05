var express = require('express');
var router = express.Router();
var CategoryController = require('../../controllers/admin/CategoryController');
var CategoryMiddleware = require('../../middlewares/admin/CategoryMiddleware');

router.get('/', CategoryController.actionIndex);

router.get('/show/:category_id', CategoryController.actionShow);

router.get('/create', CategoryController.actionCreate);
router.post('/create', CategoryMiddleware, CategoryController.actionStore);

router.get('/edit/:category_id', CategoryController.actionEdit);
router.post('/edit/:category_id', CategoryMiddleware, CategoryController.actionUpdate);

router.delete('/delete/:category_id', CategoryController.actionDelete);

router.get('/all-categories', CategoryController.actionAllCategories);

module.exports = router;