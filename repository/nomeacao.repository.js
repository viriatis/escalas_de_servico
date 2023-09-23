const Nomeacao = require('../models/nomeacao');


exports.GetById = async function (id) {
    return new Promise((resolve, reject) => {
        Nomeacao.findById(id, function (err, nomeacao) {
            if (err) reject(err);
            resolve(nomeacao);
        });
    });
}

exports.TodasNomeacoes = async function () {
    return new Promise((resolve, reject) => {
        Nomeacao.find({}, function (err, result) {
            if (err) reject(err);

            result.sort(function (a, b) {
                return new Date(a.data) - new Date(b.data)
            })
            resolve(result);
        });
    });
}

exports.GetNomeacaoPorDataEServico = async function (data, servicoid) {

    return new Promise((resolve, reject) => {
        Nomeacao.findOne({ data: data, servico: servicoid }, function (err, nomeacao) {
            if (err) reject(err);

            resolve(nomeacao);
        });
    });
}

exports.SaveNomeacao = async function (nomeacao) {

    return new Promise((resolve, reject) => {
        nomeacao.save(function (err) {
            if (err) reject(err)
            else resolve(nomeacao);
        });
    });
}

exports.UptadeNomeacao = async function (nomeacao) {

    return new Promise((resolve, reject) => {
        Nomeacao.findByIdAndUpdate(nomeacao.id, { $set: nomeacao }, function (err, result) {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    });
}

exports.TodasNomeacoesMilitarNomeado = async function (militarid) {
    return new Promise((resolve, reject) => {
        Nomeacao.find({ listaNomeados: militarid }, function (err, result) {
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

exports.GetTodasNomeacoesPrevistas = async function () {
    return new Promise((resolve, reject) => {
        Nomeacao.find({ estado: 'nomeado' }, function (err, result) {
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

exports.GetNomeacaoPorMilitarPorDataPorEstado = async function (militarid, data, estado) {
    return new Promise((resolve, reject) => {
        Nomeacao.findOne({ data: data, listaNomeados: militarid, estado: estado }, function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
}





exports.TodasNomeacoesMilitarReserva = async function (militarid) {
    return new Promise((resolve, reject) => {
        Nomeacao.find({ listaReservas: militarid }, function (err, result) {
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


exports.GetNomeacoesAtivasNumaDataPorMilitar = async function (dataatual, militarid) {
    return new Promise((resolve, reject) => {
        Nomeacao.find({ data: { $lte: dataatual }, expira: { $gt: dataatual }, listaNomeados: militarid, estado: 'ativo' }, function (err, result) {
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

exports.GetNomeacaoAnterioresParaCumprir = async function (servicoid, hoje) {
    return new Promise((resolve, reject) => {
        Nomeacao.find({ servico: servicoid, expira: { $lte: hoje }, $or: [ { estado: 'ativo' }, { estado: 'nomeado'} ]}, function (err, result) {
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


exports.getNomeacoesPorServicoDataEstado = async function (servicoid, datainicial, datafinal, estado) {

    if (datainicial == 0 && datafinal == 0) {
        return new Promise((resolve, reject) => {
            Nomeacao.find({ servico: servicoid, estado: estado }, function (err, result) {
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
    } else if (datafinal == 0) {
        return new Promise((resolve, reject) => {
            Nomeacao.find({ servico: servicoid, data: { $gte: datainicial }, estado: estado }, function (err, result) {
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
    } else if (datainicial == 0) {
        return new Promise((resolve, reject) => {
            Nomeacao.find({ servico: servicoid, data: { $lte: datafinal }, estado: estado }, function (err, result) {
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
    } else {
        return new Promise((resolve, reject) => {
            Nomeacao.find({ data: { $gte: datainicial, $lte: datafinal } }, function (err, result) {
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
}