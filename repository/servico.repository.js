const Servico = require('../models/servico');


exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        Servico.findById(id, function (err, servico) {
            if (err) reject(err);
            resolve(servico);
        });
    });
}

exports.TodosServicos = async function () {
    return new Promise((resolve, reject) => {
        Servico.find({}, function (err, result) {
            if (err) reject(err);

            resolve(result);
        });
    })
}

exports.GetServicoByNome = async function (nome) {
    return new Promise((resolve, reject) => {
        Servico.findOne({ nome: nome }, function (err, servico) {
            if (err) reject(err);
            resolve(servico);
        });
    });
}

exports.SaveServico = async function (servico) {
    
    return new Promise((resolve, reject) => {
        servico.save(function (err) {
            if (err) reject(err)
            else resolve(servico);
        });
    });
}

exports.DeleteServico = async function (id) {
    return new Promise((resolve, reject) => {
        console.log(id)

        Servico.findByIdAndDelete(id, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.UptadeServico = async function (servico) {
    
    return new Promise((resolve, reject) => {
        Servico.findByIdAndUpdate(servico.id, { $set: servico }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    });
}

exports.getServicosPorMilitar = async function (id) {
    return new Promise((resolve, reject) => {
        Servico.find({ militaresInscritos: id }, function (err, servico) {
            if (err) reject(err);
            resolve(servico);
        });
    });
}