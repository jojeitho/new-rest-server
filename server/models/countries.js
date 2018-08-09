const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    id: {
        type: String,
    },
    sortname: {
        type: String,
    },
    name: {
        type: String
    }
});


module.exports = mongoose.model('Countries', categoriaSchema);