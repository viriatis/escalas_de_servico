const InfoDia = require('../models/infodia');


exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        InfoDia.findById(id, function (err, infodia) {
            if (err) reject(err);
            resolve(infodia);
        });
    });
}

exports.TodosInfoDia = async function () {
    return new Promise((resolve, reject) => {
        InfoDia.find({}, function (err, result) {
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

exports.GetInfoDiaByData = async function (data) {
    return new Promise((resolve, reject) => {
        InfoDia.findOne({ data: data }, function (err, infodia) {
            if (err) reject(err);
            resolve(infodia);
        });
    });
}

exports.SaveInfoDia = async function (infodia) {
    infodia.data = infodia.data.setHours(0, 0, 0, 0)

    return new Promise((resolve, reject) => {
        infodia.save(function (err) {
            if (err) reject(err)
            else resolve(infodia);
        });
    });
}

exports.GetInfoDiasDumNumDias = async function (numDias) {
    var hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    var ultimoDia = new Date()
    ultimoDia.setDate(hoje.getDate() + numDias)

    return new Promise((resolve, reject) => {
        InfoDia.find({ data: { $gte: hoje, $lte: ultimoDia } }, function (err, result) {
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

exports.UptadeInfoDia = async function (infodia) {

    return new Promise((resolve, reject) => {
        InfoDia.findByIdAndUpdate(infodia.id, { $set: infodia }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    });
}

exports.GetInfoDiasDumPeriodo = async function (datainicial, datafinal) {

    return new Promise((resolve, reject) => {
        InfoDia.find({ data: { $gte: datainicial, $lte: datafinal } }, function (err, result) {
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