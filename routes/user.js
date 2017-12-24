var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

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

function noRole(req, res, next) {
    req.body.role_id = '';
    req.body.title = 'Users';
    next();
}

function setAdministratorRole(req, res, next) {
    req.body.role_id = 1;
    req.body.title = 'Administrators';
    next();
}

function setTeacherRole(req, res, next) {
    req.body.role_id = 2;
    req.body.title = 'Teachers';
    next();
}

function setStudentRole(req, res, next) {
    req.body.role_id = 3;
    req.body.title = 'Students';
    next();
}

router.get('/', noRole, UserController.actionIndex);
router.get('/administrators', setAdministratorRole, UserController.actionIndex);
router.get('/teachers', setTeacherRole, UserController.actionIndex);
router.get('/students', setStudentRole, UserController.actionIndex);

router.get('/show/:id', UserController.actionShow);

router.get('/create', UserController.actionCreate);
router.post('/create', UserController.actionStore);

module.exports = router;