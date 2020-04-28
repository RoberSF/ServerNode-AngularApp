var mongoose = require('mongoose'); // para trabajar con mongoose y sus funciones primero lo importamos


var Schema = mongoose.Schema; // Para definir esquemas primero hay que importar


var usuarioSchema = new Schema({
    nombre:{type: String, required: [true, 'El nombre es necesario']}, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    email:{type: String, unique:true, required: [true, 'El correo es necesario']}, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    password:{type: String, required: [true, 'El password es necesario']}, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    img:{type: String, requiered:false}, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    role:{type: String, requiered:true,default:'USER_ROLE'}, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
});


module.exports = mongoose.model('Usuario', usuarioSchema)
// para poder usar este archivo fuera. "Usuario" es el nombre que le doy a este esquema afuera



// 