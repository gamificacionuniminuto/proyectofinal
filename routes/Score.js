const { Router } = require('express');
const {postScore,getProblem,getScore}=require('../controller/scoreController.js');
const router = Router();

router.post('/score',postScore)
router.get('/problem',getProblem)
router.get ('/score/:id',getScore)

module.exports = router;
