// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs'); // Librería para encriptar la contraseña
var Usuario = require('../models/usuario'); // me permite usar todo lo que hay en usuarios.js
var jwt = require('jsonwebtoken') // librería para crear el token 
var SEED = require('../config/config').SEED; // es una constante por eso la tengo en un archivo aparte


//Google
var CLIENT_ID = require('../config/config').CLIENT_ID; // es una constante por eso la tengo en un archivo aparte
var GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET; // es una constante por eso la tengo en un archivo aparte
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


//***********************************************************************************************************
//                                      Autenticacio Google */
//********************************************************************************************************** */
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload(); // aquí vamos a tener la info del usuario
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,

    }
  }


  app.post('/google', (req, res,next) =>{
    var token = req.body.token;
    const oAuth2Client = new OAuth2Client(
       CLIENT_ID,
       GOOGLE_SECRET
     );
     const tiket = oAuth2Client.verifyIdToken({
       idToken: token
       //audience: GOOGLE_CLIENT_ID
     });
     tiket.then(data =>{
       res.status(200).json({
         ok: true,
         tiket: data.payload
       })
     }).catch(err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }
    });
  });



//***********************************************************************************************************
//                                      Autenticacio Normal */
//********************************************************************************************************** */
app.post('/',(request,response) => {

    var body = request.body; // esto sólo va a funcionar si tengo el body-parser

    Usuario.findOne({email: body.email}, (error, usuarioDB) => {

        if ( error ) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: error
            });
        }

        if ( !usuarioDB ) {
            return response.status(400).json({
                ok: false,
                mensaje: 'email incorrecto',
                errors: error
            });
        }

        if ( !bcrypt.compareSync(body.password, usuarioDB.password)) { // compara el string que le estamos mandando con el string que hemos encriptado 
            return response.status(400).json({
                ok: false,
                mensaje: 'password incorrecto',
                errors: error
            });
        }


        // Crear token
        usuarioDB.password = ':)'
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400})
                            // le mando una data // la semilla de mi back,lo que yo quiera // el tiempo de validez 14400=4h

        response.status(200).json({
            ok: true,
            menssage: 'Login Correcto',
            usuario: usuarioDB,
            id: usuarioDB._id,
            token: token,
            body:body
        });
    })

});














module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso
