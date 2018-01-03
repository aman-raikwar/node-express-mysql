var express = require('express');
var router = express.Router();
var SkillController = require('../controllers/SkillController');
var SkillMiddleware = require('../middlewares/SkillMiddleware');

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

router.get('/', SkillController.actionIndex);

router.get('/show/:skill_id', SkillController.actionShow);

router.get('/create', SkillController.actionCreate);
router.post('/create', SkillMiddleware, SkillController.actionStore);

router.get('/edit/:skill_id', SkillController.actionEdit);
router.post('/edit/:skill_id', SkillMiddleware, SkillController.actionUpdate);

router.delete('/delete/:skill_id', SkillController.actionDelete);

module.exports = router;