// Requires (Importación de librerías para que funcione algo)
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload'); // librería para subir archivos
const fs = require('fs'); // para borrar archivos
const path = require('path');
const Usuario = require('../models/usuario'); // me permite usar todo lo que hay en usuarios.js
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');



// ********************************************************************************************************************
//                                                 Middleware
//******************************************************************************************************************* */
// app.use(fileUpload()); 
app.use(fileUpload({ useTempFiles: true })); //actualización


// ********************RUTAS*******************************
app.put('/:tipo/:id', (request, response, next) => { // el tipo y el id son para asignarles el nombre al archivo. 


    let tipo = request.params.tipo;
    let id = request.params.id;

    console.log(tipo);

    // tipos de coleccion

    let tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'tipos de colección no válidos',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'No files'
        })
    }


    // Obtener nombre del archivo para verificar que es una imagen

    var archivo = request.files.imagen;
    var nombreCortado = archivo.name.split('.') // con esto consigo la extension. Divide por cada punto que encuentre, pero sabemos que el ultimo(split) es la extension
    var extensionArchivo = nombreCortado[nombreCortado.length - 1] //cogemos la ultima palabra del array de nombreCortado

    // Solo aceptamos estas extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Extension no valida'
        })
    }

    // Nombre de archivo personalizado para que no haya conflictos. Podemos hacerlo de la manera que queramos
    // el nombre será el id - un numero random.la extensión

    let newNameFile = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    // Muevo el archivo del limbo temporal a un path donde yo lo quiero

    let path = (`./uploads/${tipo}/${newNameFile}`); // los parentesis son obligatorios

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        console.log(tipo, id, newNameFile, response);
        subirPorTipo(tipo, id, newNameFile, response);




    })




});


function existeUsuario(tipo, id, archivo, path) {
    if (tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {

            // si no existe usuario salte fuera
            if (!usuario) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'No existe ese usuario',
                });
            }

            archivo.mv(path, error => {

                if (error) {
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

function existeMedicos() {
    if (tipo === 'medicos') {

        Medico.findById(id, (error, medico) => {

            // si no existe usuario salte fuera
            if (!medico) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'No existe ese medico',
                });
            }

            archivo.mv(path, error => {

                if (error) {
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
    if (tipo === 'hospitales') {

        Hospital.findById(id, (error, hospital) => {

            // si no existe usuario salte fuera
            if (!hospital) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'No existe ese hospital',
                });
            }

            archivo.mv(path, error => {

                if (error) {
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



    if (tipo === 'usuarios') {

        Usuario.findById(id, (error, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            // var pathViejo = './uploads/usuarios/' + usuario.img;
            var pathViejo = path.resolve(__dirname, `./uploads/usuarios/${usuario.img}`); //actualización

            // si existe img, elimina la imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }

            usuario.img = newNameFile;

            usuario.save((error, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Usuario actualizado correctamente',
                    usuarioActualizado: usuarioActualizado
                });
            })

        });
    }
    if (tipo === 'medicos') {

        Medico.findById(id, (error, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }

            // var pathViejo = './uploads/medicos/' + medico.img;
            var pathViejo = path.resolve(__dirname, `./uploads/medicos/${medico.img}`); //actualización

            // si existe img, elimina la imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }

            medico.img = newNameFile;

            medico.save((error, medicoActualizado) => {


                return response.status(200).json({
                    ok: true,
                    mensaje: 'Medico actualizado correctamente',
                    medico: medicoActualizado
                });
            })

        });
    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (error, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }


            // var pathViejo = './uploads/hospitales/' + hospital.img;
            var pathViejo = path.resolve(__dirname, `./uploads/hospitales/${hospital.img}`); //actualización

            // si existe img, elimina la imagen
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo, () => {}); // me tirraba error si no le ponía el callback 
            }

            hospital.img = newNameFile;

            hospital.save((error, hospitalActualizado) => {
                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    pathViejo: pathViejo,
                    hospital: hospitalActualizado
                });
            })

        });
    }

}
module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso