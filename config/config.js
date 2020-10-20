var express = require('express');
var app = express();

// esconde en variable de entorno como con heroku
process.env.SEED = process.env.SEED || '@este-es-mi-seed-desarrollo';
// module.exports.SEED = '@este-es-mi-seed'

//Google


CLIENT_ID = 'XXX';
GOOGLE_SECRET = 'XXX';

// Si falla igual es por tener mal puesto el module.exports
module.exports = app;
