const {User, Order} = require('../db.js');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mercadopago = require('mercadopago');

const crearOrdem = async (req, res) => {
mercadopago.configure({
    access_token: 'TEST-1592930084674897-062216-87ef0dc7158d557a2e0dd635276ea19a-655282802'
   });
//const {price}=req.body;

let preference = {
    items: [
        {
            title: 'Pago de clases',
            quantity:1,
            currency_id: 'COP',
            unit_price: 35000, //precio del producto
          
        },
    ],


        payment_methods:{
            excluded_payment_methods: [
                {
                  id: "atm"
                }
            ],
            installments: 6, //cantidad maximo de cuotas
        },
        back_urls:{
             success: "https://athens-theta.vercel.app/purchase",
            failure: "https://athens-theta.vercel.app",
            pending: "https://athens-theta.vercel.app",
        }
};

mercadopago.preferences.create(preference)
.then(function(response){
    // {url: response.body.init_point}
    res.status(200).json({url: response.body.init_point});
}).catch(function(error){
    //console.log(error);
});
}
const notificacionOrden = async(req, res) => {
    const datos = req.query;

    console.log(datos);
    res.status(200)
}
module.exports={
    notificacionOrden,
    crearOrdem
     };