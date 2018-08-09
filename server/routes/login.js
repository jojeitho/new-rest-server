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
                ok: false,
                err: {
                    message: 'usuariopoo o contraseña incorrectos'
                }
            });

        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o contraseñahhh incorrectos'
                }
            });
        }
        let token = jwt.sign({
            usuario: usuarioDB ///////CONVERTIMOS EL RESULTAOD EN TOKEN CON LA SEMILLA CREADA EN HEROKU Y LA FECHA DE EXPIRACCION
        }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

        res.status(200).json({
            ok: true,
            usuarioDB, ////SI TODO SALIO BIEN ENTONCES IMPRIMIMOS EL USUARIO COMPLETO MAS EL TOKEN
            token
        });
    });
});


////configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        img: payload.picture,
        email: payload.email,
        google: true,
        fnac: '0-0-0'
    }
} //verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let google_user = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: google_user.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'usuario autenticado sin google'
                    }
                });

            } else {
                let token = jwt.sign({
                    usuario: usuarioDB ///////CONVERTIMOS EL RESULTAOD EN TOKEN CON LA SEMILLA CREADA EN HEROKU Y LA FECHA DE EXPIRACCION
                }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            //si el usuarui no existe en la bd
            let usuario = new Usuario();

            usuario.name = google_user.name;
            usuario.email = google_user.email;
            usuario.img = google_user.img;
            usuario.google = true;
            usuario.password = 'google';
            usuario.fnac = '0-0-0';
            usuario.plataform = 'default';
            usuario.status = true;

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB ///////CONVERTIMOS EL RESULTAOD EN TOKEN CON LA SEMILLA CREADA EN HEROKU Y LA FECHA DE EXPIRACCION
                }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            })

        }



    });
});



module.exports = app;