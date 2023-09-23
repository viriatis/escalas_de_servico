const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let AgnomeacaotrocaSchema = new Schema({
    nomeacao: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Nomeacao',
        required: true
    },
    troca: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Troca',
        required: true
    }
})

module.exports = mongoose.model('Agnomeacaotroca', AgnomeacaotrocaSchema);