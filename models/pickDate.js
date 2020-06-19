var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var dateSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre	es	necesario'] },
    date: { type: Date, required: [true, 'La fecha es necesaria'] },
});

module.exports = mongoose.model('Date', dateSchema)