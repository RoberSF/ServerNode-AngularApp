const express = require('express');
const app = express();


var appRoutes = require('./app'); // el path dónde están las rutas
var usuarioRoutes = require('./usuario');
var usuarioLogin = require('./login');
var hospitalRoutes = require('./hospital');
var medicoRoutes = require('./medico');
var busquedaRoutes = require('./busqueda');
var uploadRoutes = require('./upload');
var imagenesRoutes = require('./imagenes');
var chatRoutes = require('./chat');
var dateRoutes = require('./date');
var blogRoutes = require('./blog');



app.use('/usuario', usuarioRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/hospital', hospitalRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/medico', medicoRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/busqueda', busquedaRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/upload', uploadRoutes); // se pone arriba por que si no entrarían por el de abajo
app.use('/img', imagenesRoutes);
app.use('/login', usuarioLogin); // se pone arriba por que si no entrarían por el de abajo
app.use('/chat', chatRoutes);
app.use('/date', dateRoutes);
app.use('/post', blogRoutes);
app.use('/', appRoutes); // middleware. "Cualquier match con '/' , ejecuta appRoutes"

module.exports = app;