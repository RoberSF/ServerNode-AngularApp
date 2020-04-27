// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var mongoose = require ('mongoose');





// Inicializar variables(aquí es donde se usan las librerías)
var app = express();


// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, response) => {
    if ( error ) throw error;
    console.log('Base de datoos:\x1b[32m%s\x1b[0m', 'running')
})


// Rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })


})




// Escuchar peticiones 
app.listen(4000, () => {console.log('Express Server corriendo en el puerto 4000:\x1b[32m%s\x1b[0m', 'running')});