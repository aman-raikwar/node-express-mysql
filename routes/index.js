var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index_controller');

// route middleware to make sure
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the sign-in page
    res.redirect('/auth/sign-in');
}

// router.all('/', isLoggedIn, function(req, res, next) {
//     next();
// });

router.get('/', index_controller.home);
router.get('/about', index_controller.about);

module.exports = router;