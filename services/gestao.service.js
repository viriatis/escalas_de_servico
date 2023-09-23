// const InfoDia = require('../models/infodia')

// //DIAS B

// exports.adicionar_diab = async_function(body){

// }

// exports.todos_diasb = async_function(body){

// }

// exports.todos_diasb_byAno = async_function(body){

// }

// exports.remover_diab_byID = async_function(body){

// }

// exports.remover_diab = async_function(body){

// }

//MILITARES

const Militar = require('../models/militar');
const MilitarRepository = require('../repository/militar.repository');
const ServicoRepository = require('../repository/servico.repository');
const InfoDiaRepository = require('../repository/infodia.repository');
const InfoDia = require('../models/infodia')

exports.adicionar_militar = async function (body) {
    //verificar se militar existe na API Gestão Recursos Humanos

    var militar = new Militar();

    militar.nim = body.nim;

    let newMilitar = await MilitarRepository.SaveMilitar(militar).catch(err => { return { erro: err } });

    return newMilitar
}

exports.todos_militares = async function () {
    let todosMilitares = await MilitarRepository.TodosMilitares().catch(err => { return { erro: err } });
    return todosMilitares;
}

exports.delete_militar = async function (id) {
    let militar = await MilitarRepository.DeleteMilitar(id).catch(err => { return { erro: err } });
    return militar
}

exports.get_militarbyid = async function (id) {
    let militar = await MilitarRepository.GetById(id).catch(err => { return { erro: err } });

    return militar
}

exports.getMilitarByNIM = async function (nim) {
    let militar = await MilitarRepository.GetMilitarByNIM(nim).catch(err => { return { erro: err } });
    return militar
}

exports.editar_militar = async function (id, body) {
    let militar = await MilitarRepository.GetById(id).catch(err => { return { erro: err } });

    militar.estado = body.estado;

    let newMilitar = await MilitarRepository.UpdateMilitar(militar).catch(err => { return { erro: err } });

    return newMilitar
}

exports.militaresIndisponiveisNumPeriodo = async function (body) {

    return 0
}

exports.inserirDiasB = async function (body) {
    if (body.diasb) {
        var listadias = body.diasb
        for (i = 0; i < listadias.length; i++) {
            let dia = new Date(listadias[i]);

            let infoDia = await InfoDiaRepository.GetInfoDiaByData(dia.toUTCString()).catch(err => { return { erro: err } })
            console.log('dia inserido\n', listadias[i])
            console.log('dia convertido\n', dia)
            // console.log('dia convertido\n', dia.toUTCString())
            console.log('infodia\n', infoDia)


            if (infoDia) {
                console.log(infoDia)
                infoDia.diaB = true;

                let updateinfodia = await InfoDiaRepository.UptadeInfoDia(dia).catch(err => { return { erro: err } })
                console.log('updated', dia, updateinfodia)
            } else {
                console.log('nao ha data')
                let newinfodia = new InfoDia();
                newinfodia.data = dia
                newinfodia.diaB = true

                let saveinfodia = await InfoDiaRepository.SaveInfoDia(newinfodia).catch(err => { return { erro: err } })
                console.log('new', dia, saveinfodia)
            }
        }
    }
    return true
}

// .getUnidade();
//     editarUnidade(req.body);
const UnidadeRepository = require('../repository/unidade.repository')

exports.getUnidade = async function () {
    let unidade = await UnidadeRepository.TodasUnidades().catch(err => { console.log(err) })
    return unidade
}

exports.editarUnidade = async function (body) {
    let unidade = await UnidadeRepository.TodasUnidades().catch(err => { console.log(err) })
    console.log(unidade)
    unidade[0].nome = body.nome
    unidade[0].estadoAlerta = body.estadoAlerta
    unidade[0].listaServicos = body.listaServicos

    let newUnidade = await UnidadeRepository.UpdateUnidade(unidade[0]).catch(err => { console.log(err) })

    return newUnidade
}

const TelegramBot = require('../services/telegram/telegram.bot')
const UserRepository = require('../repository/user.repository')

exports.mudarestadoalerta = async function (body) {
    let unidade = await UnidadeRepository.GetUnidade().catch(err => { return { erro: err } })
    
    let flag = false
    let texto = ''
    switch (body.estadoAlerta) {
        case 'A':
            unidade.estadoAlerta = 'A'
            texto = 'Estado de Alerta Atualizado: Alfa'
            flag = true
        case 'B':
            unidade.estadoAlerta = 'B'
            texto = 'Estado de Alerta Atualizado: Bravo'
            flag = true
        case 'C':
            unidade.estadoAlerta = 'C'
            texto = 'Estado de Alerta Atualizado: Charlie'
            flag = true
        case 'D':
            unidade.estadoAlerta = 'D'
            texto = 'Estado de Alerta Atualizado: Delta'
            flag = true
        default:
            
    }
    
    if (flag) {
        await UnidadeRepository.UpdateUnidade(unidade).catch(err => { return { erro: err } })

        let listausers = await UserRepository.AllUsers().catch(err => { return { erro: err } })
        
        if (listausers) {
            for (let i = 0; i < listausers.length; i++) {
                let user = listausers[i]
        
                if (user.chatid) {
                    TelegramBot.sendTelegramMessage(user.chatid, unidade.nome + '\n' + texto)
                }
            }
        }
    }

    return true
}