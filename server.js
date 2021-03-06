//***************************** */ Requires (Importación de librerías para que funcione algo)*********************************
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // librería para pasar la data del post en un objeto javascript


// *******************************Inicializar variables(aquí es donde se usan las librerías)************************************
const app = express();

// *******************************Para saber cual es el puerto que usa HEROKU************************************
const port = process.env.PORT || 4000;


// *****************************************************************************************************************
//                                       Middleware           CORS
//*****************************************************************************************************************/

// Ojo con el headers que tengo que mandarle el token

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
})

// **********************************Body Parser Librería*****************************************************(middleware)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())






// *******************************************Conexión a la base de datos*******************************************************
//                                              Local vs Atlas
//*****************************************************************************************************************************
// *podría ponerlo en config.js e importarlo

// ============================
//  Variables de entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/hospitaldb';
} else {
    urlDB = process.env.URLDB; //url que saco de mogoatlas=>connect => using mongo compass
}
process.env.URLDB = urlDB;


// mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', { // cuando trabajo en localhost antes de configurar mongo atlas
mongoose.connection.openUri(process.env.URLDB, {
        // lo de abajo son variables que me pide mongo al arrancar el server
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (error, response) => {
        if (error) throw error;
        console.log('Base de datos:\x1b[32m%s\x1b[0m', 'running')
    })


//************************************************************Rutas*************************************************************


app.use(require('./routes/index'));

//****************************************************Escuchar peticiones ******************************************************
app.listen(port, () => { console.log('Express Server corriendo en el puerto 4000:\x1b[32m%s\x1b[0m', 'running') });