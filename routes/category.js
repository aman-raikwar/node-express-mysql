var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/category_controller');

/****  GET category listing *****/
router.get('/', categoryController.getAllCategories);

/**** add new primary category  *****/
router.post('/add', categoryController.addCategory);
/**** get all parent categories  *****/
router.get('/get_parent_categories', categoryController.getParentCategories);
/**** add new subcategory  *****/
router.post('/add-subcategory', categoryController.addSubcategory);
/**** update a category  *****/
router.post('/update-category', categoryController.updateCategory);
/**** delete subcategories  *****/
router.delete('/delete/:category_id', categoryController.deleteCategory);
/**** delete primary categories and related subcategories  *****/
router.delete('/delete-primary/:parent_id', categoryController.deletePrimaryCategory);

module.exports = router;