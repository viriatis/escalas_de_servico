const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let ServicoSchema = new Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    diasFolga: {
        type: Number,
        default: 1,
        max: 10
    },
    tipoServico: {
        type: String,
        enum: ['rotina', 'prevencao', 'eventual'],
        required: true
    },
    numeroNomeados:{
        type: Number,
        required: true
    },
    numeroReservas:{
        type: Number,
        required: true
    },
    militaresInscritos: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
    }],
    estado: {
        type: String,
        enum: ['ativo', 'inativo'],
        default: 'ativo'
    },
    tipoDias: {
        type: String,
        enum: ['a','b','ambos'],
        default: 'ambos'
    },
    dataInicio: { 
        type: Date,
        required: true
    },
    diasAtividade: {
        type: Number,
        default: 1
    },
    diadecalculo: { //dia da semana que começa o servico
        type: String,
        enum: ['segunda', 'terca', 'quarta','quinta','sexta', 'sabado', 'domingo','diario'],
        required: true
    }
})

module.exports = mongoose.model('Servico', ServicoSchema);