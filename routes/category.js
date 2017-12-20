var express = require('express');
var router = express.Router();
var categoryController = require('../controllers/category_controller');

// route middleware to make sure
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

router.all('/', isLoggedIn, function(req, res, next) {
    next();
});

router.get('/', categoryController.actionIndex);

router.get('/show/:category_id', categoryController.actionShow);

router.get('/create', categoryController.actionCreate);
router.post('/create', categoryController.actionStore);

router.get('/edit/:category_id', categoryController.actionEdit);
router.post('/edit/:category_id', categoryController.actionUpdate);

router.delete('/delete/:category_id', categoryController.actionDelete);

router.get('/fake-data', categoryController.actionFakeData);

module.exports = router;