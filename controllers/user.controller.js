const UserService = require('../services/user.service');

exports.criar_user = async (req, res) => {
    var success = await UserService.criar_user(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(201).send(success);
    }
}

exports.ver_users = async (req, res) => {
    var success = await UserService.ver_users();

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.get_userbyId = async (req, res) => {
    var success = await UserService.get_userbyId(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}
exports.permissaoGestor = async (req, res) => {
    var success = await UserService.permissaoGestor(req.params.id, req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}



exports.apagar_user = async (req, res) => {
    var success = await UserService.apagar_user(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}