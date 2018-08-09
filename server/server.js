require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization,token, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//////habilitar el loggin y la carpeta 
console.log(path.resolve(__dirname, '../public'));
app.use(express.static(path.resolve(__dirname, '../public'))); /////RESUELVE EL PATH PARA ACCEDER


app.use(require('./routes/index')) ////configuracion de rutas
mongoose.connect(process.env.URL_DB, (err, res) => { ////////ruta para la acceder a la bd
    if (err) throw err; /////sea el caso si accede o no muestra el error
    console.log('BD ONLINE');

});


app.listen(process.env.PORT);
console.log(`Escuchando en el puerto ${process.env.PORT}`);