const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let TrocaSchema = new Schema({
    data: { //para ordenar lista trocas
        type: Date,
        required: true,
   },
    servico: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Servico',
        required: true,
    },
    militarA: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
        required: true
    },
    militarB: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
        required: true
    },
    estado: {
        type: String,
        enum: ['porconfirmar','pendente','troca','distroca', 'cumprido'], 
        default: 'pendente'
    }
})

module.exports = mongoose.model('Troca', TrocaSchema);