const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    id: {
        type: String,
    },
    name: {
        type: String,
    },
    state_id: {
        type: String
    }
});


module.exports = mongoose.model('Cities', categoriaSchema);