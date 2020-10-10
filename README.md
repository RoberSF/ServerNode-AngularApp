Hacer npm install 

Tener en cuenta el nombre de la base de datos que tengo puesto en robo 3T

npm install -g nodemon

Usamos HEroku para subir la app
    -Ojo a la variable para obtener el puerto de heroku
    -Ojo en el package.json que creo el comando para que heroku arranque la app
                El que tenía     // "start": "nodemon app.js",
                El nuevo     // "start": "node app.js"
                Añado "nodemon" y con este al ser concreto haría "npm run nodemon"