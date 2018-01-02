var express = require('express');
var router = express.Router();
var CategoryController = require('../controllers/CategoryController');
var CategoryMiddleware = require('../middlewares/CategoryMiddleware');

// route middleware to make sure
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.all('/', isLoggedIn, function(req, res, next) {
    next();
});

router.get('/', CategoryController.actionIndex);

router.get('/show/:category_id', CategoryController.actionShow);

router.get('/create', CategoryController.actionCreate);
router.post('/create', CategoryMiddleware, CategoryController.actionStore);

router.get('/edit/:category_id', CategoryController.actionEdit);
router.post('/edit/:category_id', CategoryMiddleware, CategoryController.actionUpdate);

router.delete('/delete/:category_id', CategoryController.actionDelete);

router.get('/all-categories', CategoryController.actionAllCategories);

module.exports = router;