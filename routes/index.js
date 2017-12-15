var express = require('express');
var router = express.Router();

var index_controller = require('../controllers/index_controller');

/**** GET home page ****/
router.get('/', index_controller.home);

/**** GET About page ****/
router.get('/about', index_controller.about);

module.exports = router;

// /* GET LOGIN PAGE. */
// router.get('/sign-in', function(req, res) {
//     var title = 'NodeExpressMySQL - Sign In';
//     res.render('auth/login', { title: title });
// });

// /* POST LOGIN PAGE. */
// router.post('/sign-in', function(req, res) {
//     var title = 'NodeExpressMySQL - Sign In';
//     res.render('auth/login', { title: title });
// });

// /* GET REGISTER PAGE. */
// router.get('/create-an-account', function(req, res) {
//     var title = 'NodeExpressMySQL - Create an Account';
//     res.render('auth/register', { title: title });
// });

// /* POST REGISTER PAGE. */
// router.post('/create-an-account', function(req, res) {
//     var title = 'NodeExpressMySQL - Create an Account';
//     res.render('auth/register', { title: title });
// });

// /* GET FORGOT PASSWORD PAGE. */
// router.get('/forgot-password', function(req, res) {
//     var title = 'NodeExpressMySQL - Forgot Password';
//     res.render('auth/forgotpassword', { title: title });
// });

// /* POST FORGOT PASSWORD PAGE. */
// router.post('/forgot-password', function(req, res) {
//     var title = 'NodeExpressMySQL - Forgot Password';
//     res.render('auth/forgotpassword', { title: title });
// });

// module.exports = router;