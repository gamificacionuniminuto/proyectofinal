const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = Router();
const {deleteUser,postUser,getalluser,olvidePassword,newPassword,putUser,updateUserScore
}=require('../controller/usercontroller.js');
const {crearOrdem, notificacionOrden} = require('../controller/mercadopago.js');

router.post('/user',postUser) 
router.get('/user',getalluser);
router.post("/olvide-password", olvidePassword);
router.post ("/newpassword",newPassword)
router.put('/user/:id',putUser);
router.put('/users/:id/score', updateUserScore);
router.post('/crear-orden',crearOrdem);










module.exports = router;
