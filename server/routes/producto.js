const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion'); ////AUTENTICACION POR TOKENS

const Producto = require('../models/producto'); /////MODELO DE LA BASE DE DATOS

const app = express();

app.post('/productos', verificarToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({

        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,

    });
    console.log(producto);
    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            profucto: productoDB
        })


    });





});

app.get('/productos', verificarToken, (req, res) => {

    Producto.find({ disponible: true })
        .sort('nombre')
        .limit(10)
        .populate('categoria', 'descripcion') /////jalar los campos del usuario desdecategorias y especificar que cmpos jalar
        .populate('usuario', 'name email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });


        });



});

app.get('/productos/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'name email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: 'el id no existe'
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })


        });
});

app.get('/productos/buscar/:frase', verificarToken, (req, res) => {

    let frase = req.params.frase;

    let exreg = new RegExp(frase, 'i'); //////hace que cualquier frase que pongamos sirva para buscar en la bd y no tener que poner la flase completa
    Producto.find({ nombre: exreg }) ///sele puede agregar mas parametros para la busqueda
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                productos
            })

        });


});

app.put('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: 'El id no existe'
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            });



        });


    });
});

app.delete('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra con el usuario coon id'
                }
            });

        }


        productoDB.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });

            }

            res.status(200).json({
                ok: true,
                producto: productoBorrado,
                message: 'producto borrado'
            })

        });

    });


})






module.exports = app;