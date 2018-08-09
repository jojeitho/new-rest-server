const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion'); ////AUTENTICACION POR TOKENS

const States = require('../models/states'); /////MODELO DE LA BASE DE DATOS
const Countries = require('../models/countries'); /////MODELO DE LA BASE DE DATOS
const Cities = require('../models/cities'); /////MODELO DE LA BASE DE DATOS


const app = express();

app.get('/states/:id', (req, res) => {
    let id = req.params.id;

    States.find({ country_id: id })
        .exec((err, states) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (states === "") {
                return res.status(500).json({
                    ok: false,
                    err: "vacio"
                });

            }

            res.json({
                ok: true,
                states
            });


        });



});
app.get('/countries', (req, res) => {


    Countries.find({})
        .exec((err, countries) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                countries
            });


        });



});
app.get('/cities/:id', (req, res) => {
    let id = req.params.id;

    Cities.find({ state_id: id })
        .exec((err, cities) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (cities.length < 1) {
                return res.status(500).json({
                    ok: false,
                    err: "vacio"
                });

            }

            res.json({
                ok: true,
                cities
            });


        });



});


module.exports = app;