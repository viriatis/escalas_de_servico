const Unidade = require('../models/unidade');

exports.SaveUnidade = async function (unidade) {
    return new Promise((resolve, reject) => {
        unidade.save(function (err) {
            if (err) reject(err)
            else resolve(unidade);
        });
    });
}

exports.UpdateUnidade = async function (unidade) {
    return new Promise((resolve, reject) => {
        Unidade.findByIdAndUpdate(unidade.id, { $set: unidade }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    });
}

exports.TodasUnidades = async function () {
    return new Promise((resolve, reject) => {
        Unidade.find({}, function (err, result) {
            if (err) reject(err);

            resolve(result);
        });
    })
}

exports.GetUnidade = async function () {
    return new Promise((resolve, reject) => {
        Unidade.find({}, function (err, result) {
            if (err) reject(err);
            if(result){
                resolve(result[0]);       
            }else{
                resolve(false);
            }
        });
    })
}