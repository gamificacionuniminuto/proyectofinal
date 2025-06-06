const nodemailer = require("nodemailer");
const fs = require('fs').promises;
const usergmail="gamificacionuniminuto@gmail.com"
const passgmail="rcfu stwz ryrz mvqf"
const transport=nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:usergmail,
    pass:passgmail
  },
  tls:{
    rejectUnauthorized:false
    }

})



const sendEmail = async (data) => {
  const { email, name, clave } = data;

  try {      
      let html = await fs.readFile('utils/plantillaCorreo/correo.html', 'utf8');
      html = html.replace('{{name}}', name)      
      const info = await transport.sendMail({
          from: 'gamificacionuniminuto@gmail.com', 
          to: email,
          subject: "Welcome to our website",
          text: "Welcome to our website", 
          html: html,
          attachments: [
            {
              filename: 'bienvenido.png',
              path: 'utils/img2/bienvenido.png',
              cid: 'bienvenido' 
            },
             {
              filename: 'plantilla.png',
               path: 'utils/img2/plantilla.png',
              cid: 'plantilla'               
            },
          {
                filename: 'plantillapie.png',
               path: 'utils/img2/plantillapie.png',
              cid: 'plantillapie'               
            }
            

          ]
          
      });

      console.log('Correo enviado:', info.messageId);
  } catch (error) {
      console.error('Error al enviar el correo:', error);
  }
};
const emailOlvidePassword = async (data) => {
  const { email, name, clave } = data;

  try {      
      let html = await fs.readFile('utils/plantillaCorreo/olvideContraseña.html', 'utf8');
      html = html.replace('{{name}}', name) 
      html = html.replace('{{clave}}', clave)
      const info = await transport.sendMail({
          from: 'gamificacionuniminuto@gmail.com', 
          to: email,
          subject: "Código de verificación para cambiar tu contraseña",
          text: "Código de verificación para cambiar tu contraseña", 
          html: html, 
           attachments: [
           
             {
              filename: 'plantilla.png',
               path: 'utils/img2/plantilla.png',
              cid: 'cabeza'               
            },
          {
                filename: 'plantillapie.png',
               path: 'utils/img2/plantillapie.png',
              cid: 'plantillapie'               
            }
          ]
          
      });

      console.log('Correo enviado:', info.messageId);
  } catch (error) {
      console.error('Error al enviar el correo:', error);
  }
};


exports.sendEmail=()=>sendEmail();
exports.emailOlvidePassword=()=>emailOlvidePassword();
exports.Orderemail=()=>Orderemail();
exports.PutOrderemail=()=>PutOrderemail();
exports.Billemail=()=>Billemail();


module.exports = { sendEmail,emailOlvidePassword};


