Hacer npm install 

Tener en cuenta el nombre de la base de datos que tengo puesto en robo 3T

npm install -g nodemon

## Despliegue en HE¡eroku
Usamos Heroku para subir la app
    -Ojo a la variable para obtener el puerto de heroku
    -Ojo en el package.json que creo el comando para que heroku arranque la app
                El que tenía     // "start": "nodemon app.js",
                El nuevo     // "start": "node app.js"
                Añado "nodemon" y con este al ser concreto haría "npm run nodemon"

Funciona como git => https://devcenter.heroku.com/articles/git

 https://angular-avanzado-backend-rb15.herokuapp.com/

## Librerías
Express
Mongoose
Body-parser para que las respuestas de los servicios se lean en JSON => Lo ponemos a modo middleware en app.js de la raíz
Librería Underscore(en los put) => Expande las funcionalidades de Javascript por defecto
    Usamos "pick"

## Base de datos

Como nos estamos conectando a una base de datos local, cuando despleguemos la app a Heroku, esto no va a ser válido. Por tanto, 
vamos a usar mlab para guardar la data. Sin embargo, ahora mlab es MongoDB Atlas


Robot3T
Es para conectarse a la base de datos de mongo de manera local.
