// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var Usuario = require('../models/usuario'); // me permite usar todo lo que hay en usuarios.js




// ********************RUTAS*******************************
 app.get('/', (request, response, next) => {

        Usuario.find({}, ('nombre email img role') //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
            .exec(
            
            (error,usuarios) => { 
    
            if ( error ) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usarios',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                usuarios: usuarios
            });
    
    
        }) )
    })

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso



