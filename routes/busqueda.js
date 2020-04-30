// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();





// ********************RUTAS*******************************
app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda; //esto es lo que la persona está escribiendo en ":busqueda"

    var regex = new RegExp ( busqueda, 'i'); //funcion pura de javascript. La "i" para que sea insensible a las mayusculas y minusculas

    var Hospital = require('../models/hospital');

buscarHospitales(busqueda, regex).then(hospitales => {
    response.status(200).json({ 
        ok: true,
        hospitales: hospitales  
    });

    })

    function buscarHospitales(busqueda,regex) {
    
        return new Promise( (resolve, reject) => {
    
            Hospital.find({nombre: regex}, (error, hospitales) => {
    
                if(error) {
    
                    reject('No se encuentra hospitales', error);
    
                } else {
                    resolve(hospitales) //mando la data de los hospitales
                }
            });
        });
    }
});



module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso