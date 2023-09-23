const GestaoServicos = require('../services/gestao.service')

//MILITARES
exports.adicionar_militar = async (req, res) => {
    var success = await GestaoServicos.adicionar_militar(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(201).send(success);
    }
}

exports.todos_militares = async (req, res) => {
    var success = await GestaoServicos.todos_militares();
    
    if(req.query.nim){
        success = await GestaoServicos.getMilitarByNIM(req.query.nim);
    }

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}


exports.get_militarbyid = async (req, res) => {
    var success = await GestaoServicos.get_militarbyid(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.editar_militar = async (req, res) => {
    var success = await GestaoServicos.editar_militar(req.params.id, req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.delete_militar = async (req, res) => {
    var success = await GestaoServicos.delete_militar(req.params.id);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.militaresIndisponiveisNumPeriodo = async (req, res) => {
    var success = await GestaoServicos.militaresIndisponiveisNumPeriodo(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.inserirDiasB = async (req, res) => {
    var success = await GestaoServicos.inserirDiasB(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}

exports.getUnidade = async (req, res) => {
    var success = await GestaoServicos.getUnidade();

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}
exports.editarUnidade = async (req, res) => {
    var success = await GestaoServicos.editarUnidade(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}


exports.mudarestadoalerta = async (req, res) => {
    var success = await GestaoServicos.mudarestadoalerta(req.body);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(200).send(success);
    }
}
// exports.remover_militar_byNIM = async (req, res) => {
//     var success = await GestaoServicos.todos_diasb(req.body.nim);

// if (success.erro) {
//     res.status(400).send(success);
// } else if (success == null) {
//     res.status(404).send(success);
// } else {
//     res.status(201).send(success);
// }
// }

//DIA B
// exports.adicionar_diab = async (req, res) => {
//     var success = await GestaoServicos.adicionar_diab(req.body);

//    if (success.erro) {
//     res.status(400).send(success);
// } else if (success == null) {
//     res.status(404).send(success);
// } else {
//     res.status(201).send(success);
// }
// }

// exports.remover_diab_byID = async (req, res) => {
//     var success = await GestaoServicos.remover_diab_byID(req.id);

// if (success.erro) {
//     res.status(400).send(success);
// } else if (success == null) {
//     res.status(404).send(success);
// } else {
//     res.status(201).send(success);
// }
// }

// exports.todos_diasb = async (req, res) => {
//     var success = await GestaoServicos.todos_diasb();

// if (success.erro) {
//     res.status(400).send(success);
// } else if (success == null) {
//     res.status(404).send(success);
// } else {
//     res.status(201).send(success);
// }
// }