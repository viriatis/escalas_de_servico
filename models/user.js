const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    militar: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Militar'
    },
    usertelegramid:{
        type: String,
        unique: true
    },
    chatid:{
        type: String,
        unique: true
    },
    dataLogin:{
        type: Date,
        default: new Date()
    },
    secret: {
        type: {
            base32: {
                type: String
            },
            expiration: {
                type: Date
            }
        }
    },
    password: {
        type: String
    },
    passwordtelegram: {
        type: String
    },
    gestor: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', UserSchema);