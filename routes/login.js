// Tuve que hacer npm uninstall google-auth-library --save  y después npm install google-auth-library@0.12.0 --save
// me decía  GoogleAuth is not a constructor


var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;
var mdAutenticacion = require('../middlewares/autentication');

// ==========================================
//  Autenticación De Google
// ==========================================
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        ok: true,
        token: token
    });

});

// ==========================================
//  Autenticación De Google
// ==========================================
app.post('/google', (req, res) => {

    let token = req.body.token || 'XXX';


    let client = new auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_SECRET, '');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
        function(e, login) {

            if (e) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Token no válido',
                    errors: e
                });
            }


            var payload = login.getPayload();
            // var userid = payload['sub'];
            // If request specified a G Suite domain:
            //var domain = payload['hd'];

            Usuario.findOne({ email: payload.email }, (err, usuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al buscar usuario - login',
                        errors: err
                    });
                }

                if (usuario) {

                    if (usuario.google === false) {
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Debe de usar su autenticación normal'
                        });
                    } else {

                        usuario.password = ':)';

                        let token = jwt.sign({ usuario: usuario }, SEED, { expiresIn: 14400 }); // 4 horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuario,
                            token: token,
                            id: usuario._id,
                            menu: obtenerMenu(usuario.role)
                        });

                    }

                    // Si el usuario no existe por correo
                } else {

                    var usuario = new Usuario();


                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.password = ':)';
                    usuario.img = payload.picture;
                    usuario.google = true;

                    usuario.save((err, usuarioDB) => {

                        if (err) {
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al crear usuario - google',
                                errors: err
                            });
                        }


                        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token: token,
                            id: usuarioDB._id,
                            menu: obtenerMenu(usuario.role)
                        });

                    });

                }


            });


        });




});

// ==========================================
//  Autenticación normal
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => { //findOne => busca uno que exista tal que así

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) { // comparesync compara que las contraseñas encriptadas son iguales
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas // usuario sería el payload // payload => los datos que yo quiero transformados en jwt

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });

    })


});


function obtenerMenu(ROLE) {

    var menu = [{
            title: 'Main Menu',
            icon: 'mdi mdi-gauge',
            submenu: [
                { title: 'Dashboard', url: '/dashboard' },
                { title: 'ProgressBar', url: '/progress' },
                { title: 'Charts', url: '/chart1' },
                { title: 'Drag&Drop', url: '/dragDrop' },
                { title: 'Search Inside', url: '/buscar/:' },
                { title: 'Photo', url: '/PhotoClick' },
                { title: 'Blog', url: '/blog' },
                // { title: 'Blog-post', url:'/blog-post'},

                // { title: 'Promesas', url: '/promesas' },
                // { title: 'Rxjs', url: '/rxjs' },
            ]
        },
        {
            title: 'Mantenimientos',
            icon: 'mdi mdi-folder-lock-open',
            submenu: [
                // {title: 'Usuarios',url: '/usuarios'},
                { title: 'Hospitales', url: '/hospitales' },
                { title: 'Medicos', url: '/medicos' },
            ]
        }
    ]

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ title: 'Usuarios', url: '/usuarios' }, { title: 'Blog-edit', url: '/blog-edit' })
    }


    return menu;
}


module.exports = app;