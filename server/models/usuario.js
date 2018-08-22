const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesvalidos = {
    values: ['ADMIN', 'USER'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    birthday: {
        type: String,
        required: [true, 'es necesario una fecha de cumpleaños']
    },
    email: {
        unique: true,
        type: String,
        required: [true, 'Correo necesario']

    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida']
    },
    plataform: {
        type: String,
        required: [true, 'Es necesario saber que plataformas se saben']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER',
        enum: rolesvalidos
    },
    status: {
        type: Boolean,
        default: true
    },
    tipo: {
        type: String
    },
    token: {
        type: String
    }
});


usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject(); //////retorna el nuevo objeto para no mostrar el Password a terceros solo se mantiene en el servidor
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' }); /////manda mensaje si algo requerido es ncesario o no debe erepetirse


module.exports = mongoose.model('usuario', usuarioSchema);