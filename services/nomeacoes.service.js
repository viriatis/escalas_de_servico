
// exports.todas_nomeacoes_NumPeriodo

// exports.nomeacoes_porServico_NumPeriodo

// exports.get_nomeacao

//exports.c

// exports.nomeacao_ativa
// exports.nomeacao_executada

// exports.acionar_reserva
const Nomeacao = require('../models/nomeacao')
const NomeacaoRepository = require('../repository/nomeacao.repository')
const TrocaRepository = require('../repository/troca.repository')
const ServicoRepository = require('../repository/servico.repository')
const MilitarRepository = require('../repository/militar.repository')
const AgNomeacaoTrocaRepository = require('../repository/AgNomeacaoTroca.repository')


exports.getNomeacaoPorMilitar = async function (id) {

    let listaNomeacoes = await NomeacaoRepository.TodasNomeacoesMilitarNomeado(id).catch(err => { return { erro: err } });

    let lista = []
    for(let i = 0; i<listaNomeacoes.length; i++){
        let servico = await ServicoRepository.GetById(listaNomeacoes[i].servico).catch(err => {console.log(err)})
        lista.push({
            data: listaNomeacoes[i].data.toLocaleDateString(),
            servico: servico.nome,
            estado: listaNomeacoes[i].estado
        })
    }
    return lista
}

exports.todas_nomeacoes = async function () {

    let listaNomeacoes = await NomeacaoRepository.TodasNomeacoes().catch(err => { return { erro: err } });
    let lista = [];
    for (let i = 0; i < listaNomeacoes.length; i++) {
        let servico = await ServicoRepository.GetById(listaNomeacoes[i].servico).catch(err => { return { erro: err } });
        let listaNomeados = [];
        for (let j = 0; j < listaNomeacoes[i].listaNomeados.length; j++) {
            let militar = await MilitarRepository.GetById(listaNomeacoes[i].listaNomeados[j]).catch(err => { return { erro: err } });
            listaNomeados = listaNomeados.concat(militar.nim)
        }
        let listaReservas = [];
        for (let j = 0; j < listaNomeacoes[i].listaReservas.length; j++) {
            let militar = await MilitarRepository.GetById(listaNomeacoes[i].listaReservas[j]).catch(err => { return { erro: err } });
            listaReservas = listaReservas.concat(militar.nim)
        }
        let listatrocas = [];
        let listaagnomeacoestroca = await AgNomeacaoTrocaRepository.GetAgNomeacaoTrocaByNomeacao(listaNomeacoes[i].id).catch(err => { return { erro: err } });
        if(listaagnomeacoestroca && listaagnomeacoestroca.length > 0){
            for(let j = 0; j < listaagnomeacoestroca.length; j++){
                let agregado = listaagnomeacoestroca[j]

                let troca = await TrocaRepository.GetById(agregado.troca).catch(err => { return { erro: err } });
                let militarA = await MilitarRepository.GetById(troca.militarA).catch(err => { return { erro: err } });
                let militarB = await MilitarRepository.GetById(troca.militarB).catch(err => { return { erro: err } });
                if(troca){
                    if(listaNomeacoes[i].listaNomeados.includes(troca.militarA)){
                        listatrocas.push({
                            troca: 'troca',
                            trocado:militarA,
                            efetivo:militarB
                        })
                    }else{
                        listatrocas.push({
                            troca: 'distroca',
                            trocado:militarB,
                            efetivo:militarA
                        })
                    }
                }
            }
        }
        
        let aux = {
            nomeacaoId: listaNomeacoes[i].id,
            data: listaNomeacoes[i].data,
            expira: listaNomeacoes[i].expira,
            estado: listaNomeacoes[i].estado,
            servico: servico.nome,
            nomeados: listaNomeados,
            reservas: listaReservas,
            trocas: listatrocas
        }
        lista.push(aux);
    }

    return lista
}

exports.getNomeacaoById = async function (id) {

    let nomeacao = await NomeacaoRepository.GetById(id).catch(err => { return { erro: err } });

    let servico = await ServicoRepository.GetById(nomeacao.servico).catch(err => { return { erro: err } });
    if (nomeacao) {

        let listaNomeados = [];
        for (let j = 0; j < nomeacao.listaNomeados.length; j++) {
            let militar = await MilitarRepository.GetById(nomeacao.listaNomeados[j]).catch(err => { return { erro: err } });
            listaNomeados = listaNomeados.concat(militar.nim)
        }

        let listaReservas = [];
        for (let j = 0; j < nomeacao.listaReservas.length; j++) {
            let militar = await MilitarRepository.GetById(nomeacao.listaReservas[j]).catch(err => { return { erro: err } });
            listaReservas = listaReservas.concat(militar.nim)
        }

        let listatrocas = [];
        let listaagnomeacoestroca = await AgNomeacaoTrocaRepository.GetAgNomeacaoTrocaByNomeacao(nomeacao.id).catch(err => { return { erro: err } });
        if(listaagnomeacoestroca && listaagnomeacoestroca.length > 0){
            for(let j = 0; j < listaagnomeacoestroca.length; j++){
                let agregado = listaagnomeacoestroca[j]

                let troca = await TrocaRepository.GetById(agregado.troca).catch(err => { return { erro: err } });
                let militarA = await MilitarRepository.GetById(troca.militarA).catch(err => { return { erro: err } });
                let militarB = await MilitarRepository.GetById(troca.militarB).catch(err => { return { erro: err } });
                if(troca){
                    if(nomeacao.listaNomeados.includes(troca.militarA)){
                        listatrocas.push({
                            troca: 'troca',
                            trocado:militarA,
                            efetivo:militarB
                        })
                    }else{
                        listatrocas.push({
                            troca: 'distroca',
                            trocado:militarB,
                            efetivo:militarA
                        })
                    }
                }
            }
        }
        
        return {
            nomeacaoId: nomeacao.id,
            data: nomeacao.data.toLocaleDateString(),
            expira: nomeacao.expira.toLocaleDateString(),
            estado: nomeacao.estado,
            servico: servico.nome,
            nomeados: listaNomeados,
            reservas: listaReservas,
            trocas: listatrocas
        }
    }else{
        return false
    }
}