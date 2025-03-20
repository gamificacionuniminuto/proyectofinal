const {User} = require('../db.js');
const { Router } = require('express');
const sequelize = require('../db');


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
      const { name, lastName, email, image, password, passConfirmation, rol, clave, isBlocked } = req.body;        
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
      });     
      return res.status(201).json(newUser);
    } catch (error) {      
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
module.exports={
    
    deleteUser,
    postUser,
    getalluser,
    
    }