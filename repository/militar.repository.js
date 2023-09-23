const Militar = require('../models/militar');


exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        Militar.findById(id, function (err, militar) {
            if (err) reject(err);
            resolve(militar);
        });
    });
}

exports.TodosMilitares = async function () {
    return new Promise((resolve, reject) => {
        Militar.find({}, function (err, result) {
            if (err) reject(err);
            
            resolve(result);
        });
    });
}

exports.GetMilitarByNIM = async function (nim) {
    return new Promise((resolve, reject) => {
        Militar.findOne({ nim: nim }, function (err, militar) {
            if (err) reject(err);
            resolve(militar);
        });
    });
}

exports.SaveMilitar = async function (militar) {
    return new Promise((resolve, reject) => {
        militar.save(function (err) {
            if (err) reject(err)
            else resolve(militar);
        });
    });
}

exports.UpdateMilitar = async function (militar) {
    
    return new Promise((resolve, reject) => {
        Militar.findByIdAndUpdate(militar.id, { $set: militar }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    });
}

exports.DeleteMilitar = async function (id) {
    return new Promise((resolve, reject) => {
        console.log(id)
        
        Militar.findByIdAndDelete(id, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}