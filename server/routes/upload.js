const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario'); ///modelo de usuarios

const Producto = require('../models/producto'); //modelo productos

const fs = require('fs'); ///FILESYSTEM

const path = require('path'); ///PATH

// default options
app.use(fileUpload()); //se puede tener mas configuraciones

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo; ////USER O PRODUCTO
    let id = req.params.id; ////ID DE QUE LO SUBE
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: 'No se a seleccionado ningun archivo para cargar'
        });
    }

    ////validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) { /////devueve si lo que se escribio esta en el arreglo si esta manda 0 o mas sino menos
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo usuario o producto no valida'
            }
        })

    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let fotoPerfil = req.files.archivo; //////el ultimo punto es como lo va a leer el servidor el nombre de la imagen o daro
    // Use the mv() method to place the file somewhere on your server


    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']; ///las extenciones que permitiremos

    let nombreArchivocortado = fotoPerfil.name.split('.'); ////separar el nombre del archivo y su extencion
    let extencion = nombreArchivocortado[nombreArchivocortado.length - 1]; //guardar la extencion del archivo en una varianle

    if (extencionesValidas.indexOf(extencion) < 0) { ////comparar si esa extencion existe en el arreglo creado 0 si no existe y manda la respuesta
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extencion no valida'
            }
        })

    }


    /////////////////////////nombre del archivo con id-milisegundos-extencion

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    fotoPerfil.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => { //ruta donde guardaremos el archivo
        if (err)
            return res.status(500).json({

                ok: false,
                err
            });

        if (tipo === 'usuarios') {
            ImagenUsuario(id, res, nombreArchivo); /////llamamos al metodo actualizar url usuario para la bd

        }
        if (tipo === 'productos') {
            ImagenProducto(id, res, nombreArchivo); /////llamamos al metodo actualizar url usuario para la bd

        }
        ///////el archivo ya se guardoo hasta aqui

    });
});

function ImagenUsuario(id, res, nombreArchivo) { ///////////////////metodo imagen usuario

    Usuario.findById(id, (err, usuarioDB) => {


        if (err) {

            borarImagen(nombreArchivo, 'usuarios'); ///borrar la imagn subida para que nose guarde en cache 
            return res.status(500).json({
                ok: false,
                err

            });
            /////////////////////PRIMERO VERIFICAMOS SI EL USUARIO EXISTE EN LA BD
        }

        if (!usuarioDB) {

            borarImagen(nombreArchivo, 'usuarios'); ///borrar la imagn subida para que nose guarde en cache 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            });
        }


        borarImagen(usuarioDB.img, 'usuarios'); /////si exixte el usuario lo agrega a la base de datos y borra el archivo anterior


        usuarioDB.img = nombreArchivo; //////////////////////////AQUI VERIFICAMOS EL NOMBRE DEL IMG DE LA BD POR EL NOMBRE DEL ARCHIVO
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });

            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })

        })



    });

}

function ImagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {


        if (err) {

            borarImagen(nombreArchivo, 'productos'); ///borrar la imagn subida para que nose guarde en cache 
            return res.status(500).json({
                ok: false,
                err

            });
            /////////////////////PRIMERO VERIFICAMOS SI EL USUARIO EXISTE EN LA BD
        }

        if (!productoDB) {

            borarImagen(nombreArchivo, 'productos'); ///borrar la imagn subida para que nose guarde en cache 
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }


        borarImagen(productoDB.img, 'productos'); /////si exixte el usuario lo agrega a la base de datos y borra el archivo anterior


        productoDB.img = nombreArchivo; //////////////////////////AQUI VERIFICAMOS EL NOMBRE DEL IMG DE LA BD POR EL NOMBRE DEL ARCHIVO
        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err

                });

            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })

        })



    });


}



function borarImagen(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;