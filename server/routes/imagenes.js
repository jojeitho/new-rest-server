const express = require('express');

const fs = require('fs');

const { verificarToken, verificarTokenImagen } = require('../middlewares/autenticacion');

const path = require('path');

let app = express();



app.get('/imagen/:tipo/:img', (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = `./uploads/${tipo}/${img}`;



    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noimagepath = path.resolve(__dirname, '../assets/default-user.png');

        res.sendFile(noimagepath);

    }



});







module.exports = app;