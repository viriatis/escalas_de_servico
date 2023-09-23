const Agnomeacaotroca = require('../models/agnomeacaotroca')

exports.SaveAgnomeacaotroca = async function (agnomeacaotroca) {
    return new Promise((resolve, reject) => {
        agnomeacaotroca.save(function (err) {
            if (err) reject(err)
            else resolve(agnomeacaotroca);
        });
    });
}

exports.DeleteAgnomeacaotroca = async function (id) {
    return new Promise((resolve, reject) => {
        Agnomeacaotroca.findByIdAndDelete(id, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        Agnomeacaotroca.findById(id, function (err, agnomeacaotroca) {
            if (err) reject(err);
            resolve(agnomeacaotroca);
        });
    });
}

exports.GetAgNomeacaoTrocaByNomeacao = async function (nomeacaoid) {
    return new Promise((resolve, reject) => {
        Agnomeacaotroca.find({ nomeacao: nomeacaoid }, function (err, agnomeacaotroca) {
            if (err) reject(err);
            resolve(agnomeacaotroca);
        });
    });
}

exports.GetAgNomeacaoTrocaByTroca = async function (trocaid) {
    return new Promise((resolve, reject) => {
        Agnomeacaotroca.find({ troca: trocaid }, function (err, agnomeacaotroca) {
            if (err) reject(err);
            resolve(agnomeacaotroca);
        });
    });
}