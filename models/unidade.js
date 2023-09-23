const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let UnidadeSchema = new Schema({
    nome: { 
        type: String, 
        default: 'Regimento Transmissoes Porto',
        unique: true,
        required: true
    },
    listaServicos: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Servico',
    }],
    estadoAlerta: {
        type: String,
        enum: ['A','B','C','D']
    }
})

module.exports = mongoose.model('Unidade', UnidadeSchema);