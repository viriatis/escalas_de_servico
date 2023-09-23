
const NomeacaoServices = require('../services/nomeacoes.service')

exports.getNomeacaoPorMilitar = async (req, res) => {
    var success = await NomeacaoServices.getNomeacaoPorMilitar(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.todas_nomeacoes = async (req, res) => {
    var success = await NomeacaoServices.todas_nomeacoes();

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.getNomeacaoById = async (req, res) => {
    var success = await NomeacaoServices.getNomeacaoById(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.ativarnomeacaoeventual = async (req, res) => {
    // var success = await NomeacaoServices.ativarnomeacaoprevencao(req.params.id);

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

exports.ativarnomeacaoprevencao = async (req, res) => {
    // var success = await NomeacaoServices.ativarnomeacaoprevencao(req.params.id);

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

exports.editarnomeacao = async (req, res) => {
    // var success = await NomeacaoServices.ativarnomeacaoprevencao(req.params.id);

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

// a.sort(function(a,b){
//     return new Date(a.plantingDate) - new Date(b.plantingDate)
//   })