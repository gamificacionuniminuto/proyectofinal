const generarTokenID = () => {  
  const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';  
  for (let i = 0; i < 5; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    token += caracteres.charAt(indiceAleatorio);
  }
  return token;
};
module.exports = generarTokenID;