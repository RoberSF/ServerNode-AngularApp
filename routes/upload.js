// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
const fileUpload = require('express-fileupload'); // librería para subir archivos


// ********************************************************************************************************************
//                                                 Middleware
//******************************************************************************************************************* */
app.use(fileUpload()); 


// ********************RUTAS*******************************
app.put('/', (request, response, next) => {

    if ( !request.files ) {
        response.status(400).json({ 
            ok: false,
            mensaje: 'No files'
        })
    }


    // Obtener nombre del archivo para verificar que es una imagen

    var archivo = request.files.imagen;
    var nombreCortado = archivo.name.split('.') // con esto consigo la extension. Divide por cada punto que encuentre, pero sabemos que el ultimo(split) es la extension
    var extensionArchivo = nombreCortado[nombreCortado.length-1] //cogemos la ultima palabra del array de nombreCortado

    // Solo aceptamos estas extensiones

    var extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg'];

    if ( extensionesValidas.indexOf(extensionArchivo) < 0) {
        response.status(400).json({ 
            ok: false,
            mensaje: 'Extension no valida'
        })
    }

    response.status(200).json({ 
        ok: true,
        mensaje: 'Petición realizada correctamente',
        extensionArchivo: extensionArchivo
    })


})

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso