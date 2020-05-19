var jwt = require('jsonwebtoken') // librería para crear el token 
var SEED = require('../config/config').SEED;



//Esta es cuando mandas el token por la url

// app.use('/', (request,response,next) => {

//     var token = request.query.token;

//     jwt.verify (token, SEED, (error, decoded )=> {

//         if (error) {
//             return response.status(401).json({
//                 ok: false,
//                 mensaje: 'Token incorrecto',
//                 errors: error
//             });
//         }

//         next();


//     });

// });



// ==========================================
// Enviar token por headers
//(Acordarse en postman de ponerlo en authorizacion, content-type)
// ==========================================


exports.verificaToken = function(req, res, next) {
    // var token = req.query.token;
    var token = req.headers.authorization;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: err
        });
    }
    req.usuario = decoded.usuario; // no das la información que hemos enviado 
    next();
    });
   }


 // ==========================================
// Enviar token por headers
// Es otro middelware para verificar que cumple una condicion y dejar pasar al resto del código
// ==========================================


exports.verificaADMIN_ROLE = function(req, res, next) {


    var usuario = req.usuario;

    if ( usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'User con permisos insuficientes',
            
    });

   }

}