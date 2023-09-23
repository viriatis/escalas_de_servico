const TrocaServicos = require('../services/troca.service')


exports.adicionar_troca = async (req, res) => {
    var success = await TrocaServicos.adicionar_troca(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(201).send(success);
    }
}

exports.trocasbyMilitar = async (req, res) => {
    var success = await TrocaServicos.trocasbyMilitar(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.delete_troca = async (req, res) => {
    var success = await TrocaServicos.delete_troca(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.todas_trocas = async (req, res) => {
    var success = await TrocaServicos.todas_trocas();

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}