var express = require('express');
var router = express.Router();
var SkillController = require('../../controllers/admin/SkillController');
var SkillMiddleware = require('../../middlewares/admin/SkillMiddleware');

router.get('/', SkillController.actionIndex);

router.get('/show/:skill_id', SkillController.actionShow);

router.get('/create', SkillController.actionCreate);
router.post('/create', SkillMiddleware, SkillController.actionStore);

router.get('/edit/:skill_id', SkillController.actionEdit);
router.post('/edit/:skill_id', SkillMiddleware, SkillController.actionUpdate);

router.delete('/delete/:skill_id', SkillController.actionDelete);

module.exports = router;