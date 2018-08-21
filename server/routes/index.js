const express = require('express');
const app = express();
///////aqui van todos las rutas 
app.use(require('./users')) ////ruta para usar los requests...es importante que valla debajo del bodyparser
app.use(require('./login')) ////ruta para usar los requests...es importante que valla debajo del bodyparser
app.use(require('./categories'))
app.use(require('./producto'))
app.use(require('./upload'))
app.use(require('./imagenes'))
app.use(require('./states'))
app.use(require('./projects'))
module.exports = app;