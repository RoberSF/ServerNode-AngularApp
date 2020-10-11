const mongoose = require('mongoose'); // para trabajar con mongoose y sus funciones primero lo importamos
const uniqueValidator = require('mongoose-unique-validator'); // Librería de mongoose para manejar el error de celda existente


let Schema = mongoose.Schema; // Para definir esquemas primero hay que importar


var rolesValidos = {
    values: [
        'ADMIN_ROLE', 'USER_ROLE'
    ],
    message: '{VALUE} no es un rol permitido'
}

let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] }, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] }, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    password: { type: String, required: [true, 'El password es necesario'] }, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    img: { type: String, requiered: false }, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional
    role: { type: String, requiered: true, default: 'USER_ROLE', enum: rolesValidos }, // para decirle el tipo de dato que es y que es requerido=obligatorio, el mensaje es opcional. Enum => el Rol tiene que existir dentro de los que proporciono
    // enum lo que hace es permitirme solo los valores que le digo arriba
    google: { type: Boolean, default: false }

});


usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' }); // para el error que me devuelve sea mas friendly


module.exports = mongoose.model('Usuario', usuarioSchema)
    // para poder usar este archivo fuera. "Usuario" es el nombre que le doy a este esquema afuera



//