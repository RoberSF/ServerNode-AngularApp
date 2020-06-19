// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var pickDate = require('../models/pickDate');




// ********************RUTAS*******************************

app.get('/', (request, response, next) => {


    pickDate.find({}, ('nombre date'))
        .limit(5) // le estoy diciendo que me muestre sólo los 5 primeros registros. Siguiente paso? var = since
        .exec(

            (error, dates) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando fechas',
                        errors: error
                    });
                }


                response.status(200).json({
                    ok: true,
                    dates: dates,
                });



            })

})

app.post('/', (request, response) => { // mando el middleware como parámetro

    var body = request.body; // esto sólo va a funcionar si tengo el body-parser


    var dates = new pickDate({ // con esto creamos esta referencia para despues guardarlo
        nombre: body.nombre,
        date: body.date,
    });

    dates.save((error, citaGuardada) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar cita',
                errors: error
            });
        }
        response.status(200).json({
            ok: true,
            citas: citaGuardada,
        });

    });


})



// app.get('/', (request, response, next) => {

//     response.status(200).json({
//         ok: true,
//         mensaje: 'Petición realizada correctamente'
//     })


// })

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso