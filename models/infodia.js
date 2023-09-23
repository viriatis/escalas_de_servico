const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let InfoDiaSchema = new Schema({
    data: { 
        type: Date,
        required: true,
        unique: true
    },
    listaIndisponiveis: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
    }],
    listaImpedidosEscala: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
    }],
    listaFolgaAtiva: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
    }],
    listaFolgaPrevista: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar',
    }],
    //Deveria existir um objeto DiasB ou Feriados?
    diaB: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('InfoDia', InfoDiaSchema);