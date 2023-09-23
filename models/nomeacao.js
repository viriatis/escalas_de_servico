const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let NomeacaoSchema = new Schema({
    data: { 
        type: Date, 
        required: true
    },
    expira: { 
        type: Date, 
        required: true
    },
    servico: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Servico',
    },
    listaNomeados: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
    }],
    listaReservas: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Militar',
    }],
    estado: {
        type: String,
        enum: ['nomeado', 'ativo', 'editado', 'cumprido'],
        //nomeado - a nomeação não fui ainda cumprida
        //ativo - o serviço encontra-se em cumprimento
        //cumprido - serviço já foi cumprido
        //editada - a nomeaçao editada não permite que a rotina de calculo da api a altere, pois foi introduzida pelo utilizador
        default: 'nomeado'
    }
})

module.exports = mongoose.model('Nomeacao', NomeacaoSchema);