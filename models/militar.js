const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let MilitarSchema = new Schema({
    nim: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        // #comentado para versão demo
        //ATIVAR ESTE VALIDADOR PARA ACEITAR APENAS EMAILS MAIL.EXERCITO.PT
        // validate: {
        //     validator: function (v) {
        //         //utilizadores com email do exercito podem participar
        //         return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@mail.exercito.pt/igm.test(v);
        //     },
        //     message: 'Email inválido'
        // },
        // #comentado para versão demo
        // required: true,
        // unique: true
    },
    estado: {
        type: String,
        enum: ['disponivel', 'indisponivel'],
        default: 'disponivel'
        //Controlo do utilizador
        //disponivel - militar disponivel para cumprir servico em todas as escalas
        //indisponivel - militar indisponivel em todas as escalas
    }
})

module.exports = mongoose.model('Militar', MilitarSchema);