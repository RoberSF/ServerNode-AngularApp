// Requires (Importación de librerías para que funcione algo)
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs'); // Librería para encriptar la contraseña
var Post = require('../models/blogPost'); // me permite usar todo lo que hay en usuarios.js
var jwt = require('jsonwebtoken') // librería para crear el token 
var middlewareAutentication = require('../middlewares/autentication')



//****************************************************RUTAS*******************************
//*****************************************************************************************


//*******************************************Obtener usuarios********************************
app.get('/', (request, response, next) => {

    var since = request.query.since || 0; // lo que recibo por la url. Siguiente paso? .skip
    since = Number(since); // localhost:4000/usuario?since=0,1,2...

    Post.find({}, ('title intro contenido categoria date comentarios img')) //el .find es por mongoo. Las caracteristicas es para que se muestre sólo eso. Yo no quiero que me enseñe su password por ejemplo
        .skip(since) // con esto le estoy diciendo que se salte los x registros "localhost:4000/usuario?since=5"
        .limit(5) // le estoy diciendo que me muestre sólo los 5 primeros registros. Siguiente paso? var = since
        .exec(

            (error, posts) => {

                if (error) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando post',
                        errors: error
                    });
                }

                Post.count({}, (error, count) => {

                    response.status(200).json({
                        ok: true,
                        posts: posts,
                        total: count, // numero de post totales
                    });
                })


            })

})



app.get('/:id', (req, resp) => {

    var id = req.params.id;

    Post.findById(id)
        .exec( (error, post) => { // ejecuta la query a partir de aquí
            if (error) {
                return resp.status(500).json({
                    ok:false,
                    menssage: 'Error al buscar post',
                    errors: error
                });
            }

            if ( !post ) {
                return resp.status(400).json({
                    ok: false,
                    menssage: 'El post con id' + id + 'no existe'
                });
            }

            resp.status(200).json({
                ok:true,
                post: post
            });
        })
})



//***************************************** Crear posts******************************************************
// app.post('/', [ middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE],(request, response)=> { // mando el middleware como parámetro

app.post('/', (request, response) => { // mando el middleware como parámetro

    var body = request.body; // esto sólo va a funcionar si tengo el body-parser

    var post = new Post({ // con esto creamos esta referencia para despues guardarlo
        title: body.title,
        intro: body.intro,
        contenido: body.contenido,
        categoria: body.categoria, 
        date: body.date,
        comentarios: body.comentarios,
        img: body.img
    });

    post.save((error, postGuardado) => {
        if (error) {
            return response.status(400).json({
                ok: false,
                mensaje: 'Error al guardar post',
                errors: error
            });
        }
        response.status(201).json({
            ok: true,
            posts: postGuardado,
        });

    });


})

// *****************************************Actualizar Datos*************************
app.put('/:id', [middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE_o_MISMOuSUARIO], (request, response) => {

    var id = request.params.id; // para recibirlo de la URL 
    var body = request.body;

    Post.findById(id, (error, post) => { // está función es algo de mongoose. Usuario hace referencia al model. El usuario de dentro del callback es el usuario que encuentra por el id
        if (error) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al buscar post',
                errors: error
            });
        }

        if (!post) { // sí, el usuario viene null 

            return response.status(400).json({
                ok: false,
                mensaje: 'El post con el' + id + 'no existe',
                errors: { menssage: 'No existe con este Id' }
            });

        }

        post.title = body.title;
        post.intro = body.intro;
        post.contenido = body.contenido;
        post.categoria = body.categoria;
        post.date = body.date;
        post.comentarios = body.comentarios;
        post.img = body.img

        post.save((error, postGuardado) => {
            if (error) {
                return response.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar post',
                    errors: error
                });
            }


            response.status(200).json({
                ok: true,
                post: postGuardado,
            });

        });

    });

});

//***********************************eliminar un usuario***********************************

app.delete('/:id', [middlewareAutentication.verificaToken, middlewareAutentication.verificaADMIN_ROLE], (req, resp) => {

    var id = req.params.id; // el id tiene que ser el mismo nombre que aparece en la url :id

    Post.findByIdAndRemove(id, (error, postBorrado) => {
        if (error) {
            return resp.status(500).json({
                ok: false,
                mensaje: 'Error al borrar post',
                errors: error
            });
        }

        resp.status(201).json({
            ok: true,
            post: postBorrado,
        });
    })
})

module.exports = app; // exporto las rutas hacia afuera. Tendría que importarlo donde lo uso