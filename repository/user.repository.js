const User = require('../models/user');

exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

exports.GetUserByEmail = async function (useremail) {
    return new Promise((resolve, reject) => {
        User.findOne({ email: useremail }, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

exports.GetUserByChatId = async function (chatid) {
    return new Promise((resolve, reject) => {
        User.findOne({ chatid: chatid }, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

exports.GetUserByMilitarId = async function (militarid) {
    return new Promise((resolve, reject) => {
        User.findOne({ militar: militarid }, function (err, user) {
            if (err) reject(err);
            resolve(user);
        });
    });
}

exports.SaveUser = async function (user) {
    return new Promise((resolve, reject) => {
        user.save(function (err) {
            if (err) reject(err)
            else resolve(user);
        });
    });
}

exports.UpdateUser = async function (user) {
    return new Promise((resolve, reject) => {
        console.log(user)
        User.findByIdAndUpdate(user.id, { $set: user }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve('Done')
        });
    });

}

exports.AllUsers = async function () {
    return new Promise((resolve, reject) => {
        User.find({}, function (err, result) {
            if (err) reject(err);

            resolve(result);
        });
    });
}

