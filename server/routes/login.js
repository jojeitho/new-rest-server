const express = require('express');

//2do post 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            console.log(body.email);
            return res.status(400).json({
                err: {
                    message: 'User or Password Incorrect'
                }
            });

        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                err: {
                    message: 'User or Password Incorrect'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB ///////CONVERTIMOS EL RESULTAOD EN TOKEN CON LA SEMILLA CREADA EN HEROKU Y LA FECHA DE EXPIRACCION
        }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

        res.status(200).json({
            usuario: usuarioDB, ////SI TODO SALIO BIEN ENTONCES IMPRIMIMOS EL USUARIO COMPLETO MAS EL TOKEN OPCIONAL
            token
        });
    });
});


module.exports = app;