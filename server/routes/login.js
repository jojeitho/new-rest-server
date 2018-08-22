const express = require('express');

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

        console.log(usuarioDB.token);

        let userToken = new Usuario({ //campos del objeto sin el token para que no se vuelva a convertir
            name: usuarioDB.name,
            email: usuarioDB.email,
            password: usuarioDB.password,
            birthday: usuarioDB.birthday,
            plataform: usuarioDB.plataform,
            status: usuarioDB.status,
            role: usuarioDB.role,
            tipo: usuarioDB.tipo
        });
        console.log(userToken);
        let token = jwt.sign({
            usuario: userToken ///////CONVERTIMOS EL RESULTAOD EN TOKEN CON LA SEMILLA CREADA EN HEROKU Y LA FECHA DE EXPIRACCION
        }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });
        usuarioDB.token = token;
        console.log(token);

        Usuario.findByIdAndUpdate(usuarioDB.id, usuarioDB, { new: true }, (err, user) => { ///en el new true regresa el objeto actualizado si se lo quitamos regresa el anterior
            if (err) {
                return res.status(400).json({
                    err
                });
            }

            res.status(200).json({
                usuario: user ////SI TODO SALIO BIEN ENTONCES IMPRIMIMOS EL USUARIO COMPLETO MAS EL TOKEN OPCIONAL
            });

        });

    });
});


module.exports = app;