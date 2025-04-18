const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = Router();
const {deleteUser,postUser,getalluser,olvidePassword,newPassword
}=require('../controller/usercontroller.js');

router.post('/user',postUser) 
router.get('/user',getalluser);
router.post("/olvide-password", olvidePassword);
router.post ("/newpassword",newPassword)










module.exports = router;
