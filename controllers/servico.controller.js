const ServicoServicos = require('../services/servico.service')

exports.criar_servico = async (req, res) => {
    var success = await ServicoServicos.adicionar_servico(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(201).send(success);
    }
}

exports.todos_servicos = async (req, res) => {
    
    var success = await ServicoServicos.todos_servicos();

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}


exports.getservicobyid = async (req, res) => {
    var success = await ServicoServicos.get_servicobyid(req.params.id);

    if (success == null) {
        res.status(404).send(success);
    }else if (success.erro) {
        res.status(400).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.delete_servico = async (req, res) => {
    var success = await ServicoServicos.delete_servico(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.inscrever_militares = async (req, res) => {
    var success = await ServicoServicos.inscrever_militares(req.params.id, req.body);
    console.log(req.params.id)

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}


exports.getServicosPorMilitar = async (req, res) => {
    var success = await ServicoServicos.getServicosPorMilitar(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.apagar_servico = async (req, res) => {
    // var success = await ServicoServicos.apagar_servico(req.params.id);

    // if (success.erro) {
    //     res.status(400).send(success);
    // } else if (success == null) {
    //     res.status(404).send(success);
    // } else {
    //     res.status(200).send(success);
    // }

    //APAGAR
    var success = true

    res.status(200).send(success);
}