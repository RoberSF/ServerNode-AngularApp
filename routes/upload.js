// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
const fileUpload = require('express-fileupload'); // librería para subir archivos
var fs = require('fs'); // para borrar archivos
var Usuario = require('../models/usuario'); // me permite usar todo lo que hay en usuarios.js
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');



// ********************************************************************************************************************
//                                                 Middleware
//******************************************************************************************************************* */
app.use(fileUpload()); 


// ********************RUTAS*******************************
app.put('/:tipo/:id', (request, response, next) => { // el tipo y el id son para asignarles el nombre al archivo. 

    var tipo = request.params.tipo;
    var id = request.params.id;

    // tipos de coleccion

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0 ) {
        return response.status(400).json({ 
            ok: false,
            mensaje: 'tipos de colección no válidos'
        });
    }

    if ( !request.files ) {
        return response.status(400).json({ 
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
        return response.status(400).json({ 
            ok: false,
            mensaje: 'Extension no valida'
        })
    }

    // Nombre de archivo personalizado para que no haya conflictos. Podemos hacerlo de la manera que queramos
    // el nombre será el id - un numero random.la extensión

    var newNameFile = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    // Muevo el archivo del limbo temporal a un path donde yo lo quiero

    var path = (`./uploads/${tipo}/${newNameFile}`); // los parentesis son obligatorios


    existeUsuario();
    existeMedicos ();
    existeHospital();


});


function existeUsuario() {
    if ( tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {

            // si no existe usuario salte fuera
            if ( !usuario ) {
                return response.status(500).json({ 
                    ok: false,
                    mensaje: 'No existe ese usuario',
                });
            }

            archivo.mv(path, error => {

                if ( error) {
                return response.status(500).json({ 
                    ok: false,
                    mensaje: 'Error al mover archivo'
                })
            }
        
            subirPorTipo(tipo, id, newNameFile, response);
        
        
            });
        });
    }
}

function existeMedicos () {
    if ( tipo === 'medicos') {

        Medico.findById(id, (error, medico) => {

            // si no existe usuario salte fuera
            if ( !medico ) {
                return response.status(500).json({ 
                    ok: false,
                    mensaje: 'No existe ese medico',
                });
            }

            archivo.mv(path, error => {

                if ( error) {
                return response.status(500).json({ 
                    ok: false,
                    mensaje: 'Error al mover archivo'
                })
            }
        
            subirPorTipo(tipo, id, newNameFile, response);
        
        
            });
        });
    }
}


function existeHospital() {
    if ( tipo === 'hospitales') {

        Hospital.findById(id, (error, hospital) => {

            // si no existe usuario salte fuera
            if ( !hospital ) {
                return response.status(500).json({ 
                    ok: false,
                    mensaje: 'No existe ese hospital',
                });
            }

            archivo.mv(path, error => {

                if ( error) {
                return response.status(500).json({ 
                    ok: false,
                    mensaje: 'Error al mover archivo'
                })
            }
        
            subirPorTipo(tipo, id, newNameFile, response);
        
        
            });
        });
    }
}

function subirPorTipo(tipo, id, newNameFile, response) {

    if ( tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {


            var pathViejo = './uploads/usuarios/'+ usuario.img;

            // si existe img, elimina la imagen
            if ( fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }

            usuario.img = newNameFile;

            usuario.save( (error, usuarioActualizado) => {

                usuarioActualizado.password = ':)';
                return response.status(200).json({ 
                    ok: true,
                    mensaje: 'Usuario actualizado correctamente',
                    usuarioActualizado: usuarioActualizado
                });
            })

        });
    }
    if ( tipo === 'medicos') {

        Medico.findById(id, (error, medico) => {

            var pathViejo = './uploads/medicos/'+ medico.img;

            // si existe img, elimina la imagen
            if ( fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }

            medico.img = newNameFile;

            medico.save( (error, medicoActualizado) => {

               
                return response.status(200).json({ 
                    ok: true,
                    mensaje: 'Usuario actualizado correctamente',
                    medicoActualizado: medicoActualizado
                });
            })

        });
    }
    if ( tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {


            var pathViejo = './uploads/hospitales/'+ hospital.img;

            // si existe img, elimina la imagen
            if ( fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }

            hospital.img = newNameFile;

            hospital.save( (error, hospitalActualizado) => {
                return response.status(200).json({ 
                    ok: true,
                    mensaje: 'Usuario actualizado correctamente',
                    pathViejo:pathViejo,
                    hospitalActualizado: hospitalActualizado
                });
            })

        });
    }

}
module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso