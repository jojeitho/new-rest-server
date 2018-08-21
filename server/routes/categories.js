const express = require('express');

const { verificarToken, verificarUSER_ROLE } = require('../middlewares/autenticacion'); ////AUTENTICACION POR TOKENS

const Categoria = require('../models/categoria'); /////MODELO DE LA BASE DE DATOS

const app = express();



////===================
//  mostrar todas las categorias
////===================

app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'name email') /////jalar los campos del usuario desdecategorias y especificar que cmpos jalar
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
            })


        });

});
////===================
//  mostrar categoria por id
////===================

app.get('/categoria/:id', verificarToken, (req, res) => {
    // Categoria.findById()
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500)({
                ok: false,
                err
            });

        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});
////===================
//  CREAR UNA Categoria
////===================

app.post('/categoria', verificarToken, function(req, res) {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.categoria,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        console.log(categoriaDB);

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});
////===================
//  actualizar una categoria
////===================

app.put('/categoria/:id', (req, res) => {


    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        nombre_cat: body.categoria
    };
    console.log(descCategoria);
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});
////===================
//  mostrar categoria por id
////===================

app.delete('/categoria/:id', [verificarToken, verificarUSER_ROLE], (req, res) => {
    // solo admin
    // Categoria.findByIdandRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'

                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'

        });



    });





});










module.exports = app;