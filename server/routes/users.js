const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario'); ///jalamos el modulo usuario de la creacion de la tabla
const { verificarToken, verificarUSER_ROLE, verificarUSER_ROLE2 } = require('../middlewares/autenticacion') /////LLAMAMOS A VERIFICAR TOKEN
const app = express();


app.post('/usuario', [verificarToken, verificarUSER_ROLE], function(req, res) { ////los verifica comprueban si el token es correcto y que el usuario sea admin
    let body = req.body;
    let plataform = req.body.plataform;

    console.log(plataform);

    let origin = "";

    for (var i = 0; i <= 3; i++) {
        console.log(plataform[i]);

        if (!plataform[i]) {

        } else {
            origin = origin + plataform[i];

        }

    }



    let usuario = new Usuario({ ////esto es un objeto solamente
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        birthday: body.birthday,
        plataform: origin,
        status: body.status,
        role: body.role,
        img: body.files
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});






app.get('/usuario', verificarToken, function(req, res) {

    let desde = req.query.desde || 0; ////desde que registros va a empezar a cotar
    desde = Number(desde);

    let limite = req.query.limite || 5; /////cuantos registros me va a mostrar
    limite = Number(limite);

    Usuario.find({ status: true }, 'name email status fnac role')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ status: true }, (err, conteo) => {
                res.json({
                    count: conteo,
                    ok: true,
                    usuarios
                });

            })


        })
});

app.get('/plataform/:plataform', function(req, res) {

    // let desde = req.query.desde || 0; ////desde que registros va a empezar a cotar
    // desde = Number(desde);

    // let limite = req.query.limite || 5; /////cuantos registros me va a mostrar
    // limite = Number(limite);
    let plat=req.params.plataform;
    let exreg = new RegExp(plat, 'i');

    Usuario.find({ plataform: exreg }, 'name fnac plataform img')
        // .skip(desde)
        // .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if(usuarios.length===0){
                return res.status(400).json({
                    ok: false,
                    err: "no existe usuarios"
                });

            }

            Usuario.count({ status: true }, (err, conteo) => {
                res.json({
                    count: conteo,
                    ok: true,
                    usuarios
                });

            })


        })
});

app.put('/usuario/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    let plataform = req.body.plataform;

    console.log(plataform);

    let origin = "";

    for (var i = 0; i <= 3; i++) {
        console.log(plataform[i]);

        if (!plataform[i]) {

        } else {
            origin = origin + plataform[i];

        }

    }
    let body = _.pick(req.body, ['name', 'birthday']);

    body = { name: body.name, birthday: body.birthday, plataform: origin }

    console.log(body);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => { ///en el new true regresa el objeto actualizado si se lo quitamos regresa el anterior
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,

            usuarioDB


        });


    })


});


app.delete('/usuario/:id', [verificarToken, verificarUSER_ROLE], function(req, res) {

    let id = req.params.id;

    console.log(id);
    let estado = {
            status: false
        }
        // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no enontrado'
                }
            });

        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});



module.exports = app;