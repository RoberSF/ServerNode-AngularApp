var express = require('express');
var app = express();

// esconde en variable de entorno como con heroku
process.env.SEED = process.env.SEED || '@este-es-mi-seed-desarrollo';
// module.exports.SEED = '@este-es-mi-seed'

//Google

// module.exports.CLIENT_ID = '912602372070-uu6j4sri55bl9b279g9hk9fvi7mh3clm.apps.googleusercontent.com';
CLIENT_ID = '912602372070-uu6j4sri55bl9b279g9hk9fvi7mh3clm.apps.googleusercontent.com';
// module.exports.GOOGLE_SECRET = '912602372070-uu6j4sri55bl9b279g9hk9fvi7mh3clm.apps.googleusercontent.com';
GOOGLE_SECRET = '912602372070-uu6j4sri55bl9b279g9hk9fvi7mh3clm.apps.googleusercontent.com';

// Si falla igual es por tener mal puesto el module.exports
module.exports = app;