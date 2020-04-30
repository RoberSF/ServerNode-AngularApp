var express = require('express');
var app = express();
var middlewareAutentication = require('../middlewares/autentication')
var Medico = require('../models/medico');



//*****************************************************************************************************
//                                          RUTAS
//*****************************************************************************************************



//*****************************************************************************************************
//                                          Get Hospitales
//*****************************************************************************************************

app.get('/', (request, response) => {
    Medico.find({}) //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec(
            
            (error,medicos) => { 
    
            if ( error ) {
                return response.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando medicos',
                    errors: error
                });
            }
            response.status(200).json({
                ok: true,
                medicos: medicos
            });
        }) 

    })


//*****************************************************************************************************
//                                          Añadir Hospitales
//*****************************************************************************************************

app.post('/', middlewareAutentication.verificaToken, (request, response) => {

    var body = request.body;
    var medico = new Medico({  // con esto creamos esta referencia para despues guardarlo
        nombre: body.nombre,
        usuario: request.usuario._id,
        hospital: body.hospital
    });

    medico.save((error,medicoGuardado) => {
        if ( error ) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar medico',
                errors: error
            });
        }
        response.status(201).json({
            ok: true,
            medico: medicoGuardado,
        });

    });
})

//*****************************************************************************************************
//                                          Actualizar Hospitales
//*****************************************************************************************************

app.put('/:id', middlewareAutentication.verificaToken, (request, response) => {

    var id = request.params.id; // para recibirlo de la URL 
    var body = request.body; 

    Medico.findById(id, (error, medico) => { // está función es algo de mongoose. Usuario hace referencia al model. El usuario de dentro del callback es el usuario que encuentra por el id
        if ( error ) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: error
            });
        }

        if ( !medico ) { // sí, el usuario viene null 
            
            return response.status(400).json({
                ok: false,
                mensaje: 'El medico con el' + id + 'no existe',
                errors: {menssage: 'No existe con este Id'}
            });
        }
        medico.nombre = body.nombre;
        // medico.img = body.img;
        medico.usuario = request.usuario._id;
        medico.usuario = body.hospital; // este parametro lo recibimos desde angular

        medico.save((error,medicoGuardado) => {
            if ( error ) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: error
                });
            }
        response.status(200).json({
            ok: true,
            usuario: medicoGuardado,
            });
        });
    });
});

//*****************************************************************************************************
//                                          Borrar Hospitales
//*****************************************************************************************************

app.delete('/:id', middlewareAutentication.verificaToken, (request,response) => {

    var id = request.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    Medico.findByIdAndRemove(id, (error, medicoBorrado) => {
        if ( error ) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: error
            });
        }

        if ( !medicoBorrado) {
            return response.status(400).json({
                ok:false,
                mensaje: 'No existe un medico con ese id',
                errors: {message: 'No existe un medico con ese id'}
            });
        } 

        resp.status(201).json({
            ok: true,
            medico: medicoBorrado,
        });
    })
})


module.exports = app;