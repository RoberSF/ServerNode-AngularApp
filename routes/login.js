// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs'); // Librería para encriptar la contraseña
var Usuario = require('../models/usuario'); // me permite usar todo lo que hay en usuarios.js
var jwt = require('jsonwebtoken') // librería para crear el token 
var SEED = require('../config/config').SEED;



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
