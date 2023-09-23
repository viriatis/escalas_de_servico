const TrocaRepository = require('../repository/troca.repository')
const Troca = require('../models/troca')

exports.adicionar_troca = async function (body) {
    var troca = new Troca();
    var hoje = new Date();
    // hoje.setHours(0,0,0,0)

    troca.data = hoje
    troca.servico = body.servico
    troca.militarA = body.militara
    troca.militarB = body.militarb

    let newTroca = await TrocaRepository.SaveTroca(troca).catch(err => { return { erro: err } });

    return newTroca
}

exports.trocasbyMilitar = async function (id) {
    let trocas = TrocaRepository.GetTrocaByMilitarA(id).catch(err => { return { erro: err } });
    trocas.concat(TrocaRepository.GetTrocaByMilitarB)

    return trocas;
}

exports.delete_troca = async function (id) {
    let troca = TrocaRepository.DeleteTroca(id).catch(err => { return { erro: err } });
    if (troca) {
        return true
    } else {
        return false
    }
}

exports.todas_trocas = async function () {
    let lista = TrocaRepository.AllTrocas().catch(err => { return { erro: err } });

    return lista
}

exports.trocaEstadoAnterior = async function (troca) {
    let lista = ['pendente', 'troca', 'distroca', 'cumprido']

    switch (troca.estado) {
        case 'pendente':
            troca.estado = 'pendente'
            break;
        case 'troca':
            troca.estado = 'pendente'
            break;
        case 'distroca':
            troca.estado = 'troca'
            // code block
            break;
        case 'cumprido':
            troca.estado = 'distroca'
            break;
        default:
        // code block
    }
    let newTroca = await TrocaRepository.UptadeTroca(troca)

    return newTroca
}

exports.trocaEstadoSeguinte = async function (troca) {
    let lista = ['pendente', 'troca', 'distroca', 'cumprido']

    switch (troca.estado) {
        case 'pendente':
            troca.estado = 'troca'
            break;
        case 'troca':
            troca.estado = 'distroca'
            break;
        case 'distroca':
            troca.estado = 'cumprido'
            // code block
            break;
        case 'cumprido':
            troca.estado = 'cumprido'
            break;
        default:
        // code block
    }
    let newTroca = await TrocaRepository.UptadeTroca(troca)

    return newTroca
}