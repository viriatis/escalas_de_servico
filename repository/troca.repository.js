const Troca = require('../models/troca')

exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        Troca.findById(id, function (err, troca) {
            if (err) reject(err);
            resolve(troca);
        });
    });
}

exports.GetTrocaByMilitarAEstadoPendentes = async function (servicoid, militarAId) {
    return new Promise((resolve, reject) => {
        Troca.find({ servico:servicoid, militarA: militarAId, estado: 'pendente' }, function (err, result) {
            if (err) reject(err);

            if(result){
                result.sort(function(a,b){
                    return new Date(a.data) - new Date(b.data)
                })
                resolve(result);
            }else{
                resolve(false)
            }
        });
    });
}

exports.GetTrocaByMilitarBEstadoTroca = async function (servicoid, militarBId) {
    return new Promise((resolve, reject) => {
        Troca.find({ servico:servicoid, militarB: militarBId, estado: 'troca' }, function (err, result) {
            if (err) reject(err);
            if(result){
                result.sort(function(a,b){
                    return new Date(a.data) - new Date(b.data)
                })
                resolve(result);
            }else{
                resolve(false)
            }
        });
    });
}

exports.TrocaByIDandEstado = async function ( id, estado) {
    return new Promise((resolve, reject) => {
        Troca.find({ id: id, estado: estado }, function (err, troca) {
            if (err) reject(err);
            resolve(troca);
        });
    });
}

exports.AllTrocas = async function () {
    return new Promise((resolve, reject) => {
        Troca.find({}, function (err, result) {
            if (err) reject(err);
            if(result){
                result.sort(function(a,b){
                    return new Date(a.data) - new Date(b.data)
                })
                resolve(result);
            }else{
                resolve(false)
            }
        });
    });
}


exports.SaveTroca = async function (troca) {
    return new Promise((resolve, reject) => {
        troca.save(function (err) {
            if (err) reject(err)
            else resolve(troca);
        });
    });
}

exports.DeleteTroca = async function (id) {
    return new Promise((resolve, reject) => {
        Troca.findByIdAndDelete(id, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}

exports.UptadeTroca = async function (troca) {
    
    return new Promise((resolve, reject) => {
        Troca.findByIdAndUpdate(troca.id, { $set: troca }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    });
}

exports.GetTrocasPorConfirmarMilitarB = async function(militarBid){
    return new Promise((resolve, reject) => {
        Troca.find({ militarB: militarBid, estado: 'porconfirmar' }, function (err, result) {
            if (err) reject(err);
            if (result) {
                result.sort(function (a, b) {
                    return new Date(a.data) - new Date(b.data)
                })
                resolve(result);
            } else {
                resolve(false)
            }
        });
    });
}