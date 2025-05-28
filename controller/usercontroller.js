const {User} = require('../db.js');
const { Router } = require('express');
const sequelize = require('../db');
const {sendEmail}=require('../utils/email.js');
const {emailOlvidePassword}=require('../utils/email.js');
const generarTokenID=require('../utils/generarTokenUser.js');
const { hashPassword } = require("../utils/hashPassword.js");

const getalluser=async(req,res)=>{
    const user = await User.findAll();
    res.json(user);
}
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!id || !user) {
      return res.status(400).json({msg:'No se ha especificado el id o Usuario no econtrado'});
    }
    await user.destroy();
    res.status(200).json({ msg: 'Usuario eliminado' });
  }
  const postUser = async (req, res, next) => {
    try {
      const { name, lastName, email, image, password, passConfirmation, rol, clave, isBlocked,parent,emailparent } = req.body;
  
      if (!name || !lastName || !email || !password || !passConfirmation) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'El email no tiene un formato válido' });
      }
  
      const user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }
  
      const comparePass = (a, b) => a === b;
      if (!comparePass(password, passConfirmation)) {
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });
      }
      
  
      const newUser = await User.create({
        name,
        lastName,
        email,
        image,
        password,
        passConfirmation,
        rol,
        clave,
        isBlocked,
        parent,
        emailparent
      });
  
      try {
        await sendEmail({
          email: newUser.email,
          name:newUser.name
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);        
      }
  
      return res.status(201).json(newUser);
  
    } catch (error) {
      console.error('Error in postUser:', error);
  
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          message: 'Error de validación',
          errors: error.errors.map((err) => err.message),
        });
      }
  
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
  
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };
  
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const mail = email;

  const userExists = await User.findOne({
    where: { email },
  });

  if (!userExists) {
   
    return res.status(400).json({ msg: `El usuario con el mail ${email} no existe` });
  }

  try {
    userExists.clave = generarTokenID();
    await userExists.save();

    emailOlvidePassword({
      email: userExists.email,
      name: userExists.name,
      clave: userExists.clave,
      id: userExists.id,
    });

    return res.json({
      msg: `Hemos enviado un email a ${userExists.email} con las instrucciones`,
    });
  } catch (error) {
    console.log(error);
  }
};
const newPassword = async (req, res) => {
  const { clave, password, email } = req.body;

  if (!password) {
    return res.status(400).json({ msg: "Contraseña solicitada no ingresada" });
  }

  if (!clave) {
    return res.status(400).json({ msg: "Clave requerida para validar el cambio de contraseña" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }   
    if (user.clave !== clave) {
      return res.status(400).json({ msg: "Clave incorrecta" });    }

    user.password = await hashPassword(password);
    user.clave = ""; 
    await user.save();

    return res.json({ msg: "Contraseña cambiada correctamente" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error del servidor" });
  }
};
const putUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, lastName, rol,isBlocked,image,emailparent,email } = req.body;  
  try{
  await User.update({  
    rol,isBlocked,name,lastName,image,emailparent,email
  },{where:{id}});
  res.status(200).json({msg:'Usuario actualizado'});
  }catch(error){
      next(error);
  }
};
const updateUserScore = async (req, res, next) => {
    const { id } = req.params;
    const { numberToAdd } = req.body;   
    if (numberToAdd === undefined || numberToAdd === null || isNaN(numberToAdd)) {
        return res.status(400).json({ 
            success: false,
            msg: 'El número a sumar debe ser un valor numérico válido' 
        });
    }
    try {        
        const user = await User.findByPk(id);        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                msg: 'Usuario no encontrado' 
            });
        }        
        const currentScore = Number(user.score) || 0;
        const numberToAddValue = Number(numberToAdd);       
        const newScore = currentScore + numberToAddValue;     
        await user.update({ score: newScore });
        return res.status(200).json({ 
            success: true,
            msg: 'Score actualizado correctamente',
            data: {
                userId: id,
                numberAdded: numberToAddValue,
                previousScore: currentScore,
                newScore: newScore
            }
        });
    } catch (error) {
        console.error('Error updating user score:', error);
        return res.status(500).json({ 
            success: false,
            msg: 'Error interno del servidor',
            error: error.message 
        });
    }
};
  
module.exports={
    
    deleteUser,
    postUser,
    getalluser,
    olvidePassword,
    newPassword,
    putUser,
    updateUserScore
    
    }