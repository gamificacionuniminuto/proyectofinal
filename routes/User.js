const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = Router();
const {deleteUser,postUser,getalluser  
}=require('../controller/usercontroller.js');
const {postScore,generateProblem,getProblem}=require('../controller/scoreController.js');
// ruta para crear un usuario *
router.post('/user',postUser) 
router.get('/user',getalluser);
router.post('/prueba',postScore)
router.get('/problem',getProblem)









module.exports = router;
