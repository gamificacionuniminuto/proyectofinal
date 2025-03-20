const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = Router();
const {deleteUser,postUser,getalluser  
}=require('../controller/usercontroller.js');
// ruta para crear un usuario *
router.post('/user',postUser) 
router.get('/user',getalluser);








module.exports = router;
