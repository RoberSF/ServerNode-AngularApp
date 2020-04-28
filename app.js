//***************************** */ Requires (Importación de librerías para que funcione algo)*********************************
var express = require('express');
var mongoose = require ('mongoose');





// *******************************Inicializar variables(aquí es donde se usan las librerías)************************************
var app = express();






// *******************************************Conexión a la base de datos*******************************************************
mongoose.connection.openUri('mongodb://localhost:27017/hospitaldb', (error, response) => {
    if ( error ) throw error;
    console.log('Base de datoos:\x1b[32m%s\x1b[0m', 'running')
})


//*********************************************Importar rutas que voy a usar****************************************************

var appRoutes = require('./routes/app'); // el path dónde están las rutas

var usuarioRoutes = require('./routes/usuario')





//************************************************************Rutas*************************************************************


app.use('/usuario', usuarioRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/', appRoutes); // middleware. "Cualquier match con '/' , ejecuta appRoutes"





//****************************************************Escuchar peticiones ******************************************************
app.listen(4000, () => {console.log('Express Server corriendo en el puerto 4000:\x1b[32m%s\x1b[0m', 'running')});