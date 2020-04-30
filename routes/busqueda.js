// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');



// ********************RUTAS*******************************
app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda; //esto es lo que la persona está escribiendo en ":busqueda"

    var regex = new RegExp ( busqueda, 'i'); //funcion pura de javascript. La "i" para que sea insensible a las mayusculas y minusculas


    Promise.all([ // nos permite mandar un array de promesas y si se cumplen todas ejecuta el then y si no manejamos el catch
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda,regex),
        buscarUsuario(busqueda,regex)
    ]).then(respuestas => {
        
        response.status(200).json({ 
            ok: true,
            hospitales: respuestas[0], //van en el orden que establezco en el array de promesas
            medicos: respuestas[1],
            usuarios: respuestas[2]

        });
    })
}); // hasta aquí método get



function buscarHospitales(busqueda,regex) {
    
    return new Promise( (resolve, reject) => {

        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((error, hospitales) => {

            if(error) {

                reject('No se encuentra hospitales', error);

            } else {
                resolve(hospitales) //mando la data de los hospitales
            }
        });
    });
}


function buscarMedicos(busqueda,regex) {
    
    return new Promise( (resolve, reject) => {

        Medico.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((error, medicos) => {

            if(error) {

                reject('No se encuentra hospitales', error);

            } else {
                resolve(medicos) //mando la data de los hospitales
            }
        });
    });
}

// nos imaginamos que buscamos por el nombre y por el email a la vez
function buscarUsuario(busqueda,regex) {
    
    return new Promise( (resolve, reject) => {

        Usuario.find({}, 'nombre email role') // así no me sale el password
        .or([ { 'nombre':regex} , { 'email': regex}]) // es una expresion del mongoose. Es un array de condiciones
        .exec( (error, usuarios) => {
            if(error) {

                reject('No se encuentra usuarios', error);

            } else {
                resolve(usuarios) //mando la data de los hospitales
            }
        })
    }
    )}

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso