const Servico = require('../models/servico')
const ServicoRepository = require('../repository/servico.repository')
const Militar = require('../models/militar')
const MilitarRepository = require('../repository/militar.repository')
const Unidade = require('../models/unidade')
const UnidadeRepository = require('../repository/unidade.repository')
const GestorDeEscalas = require('../services/gestordeescalas.service')


booting = async function () {
    console.log('Bootstrap running.....OK!')
    /*
    * CRIANDO MILITARES
    */
    // console.log('Criando militares.....OK!')
    // var i = 0
    // numMilitares = 20
    // for (i = 0; i < numMilitares; i++) {

    //     let temp = new Militar()
    //     temp.nim = 'A' + i
    //     if (i == 0) {
    //         temp.email = '1050475@isep.ipp.pt'
    //     }

    //     await MilitarRepository.SaveMilitar(temp).catch(err=> {console.log(err)})
    // }

    let todosmilitares = await MilitarRepository.TodosMilitares().catch(err=> {console.log(err)});

    var listamilitares = []

    for (i = 0; i < todosmilitares.length; i++) {

        listamilitares.push(todosmilitares[i].id)
    }

    /*
    * CRIANDO SERVICOS
    */
    console.log('Criando servicos.....OK!')
    let servicoA = new Servico()
    let servicoB = new Servico()
    //servicoA
    servicoA.nome = 'Sargento de Dia A'
    servicoA.diasFolga = 1
    servicoA.tipoServico = 'rotina'
    servicoA.numeroNomeados = 1
    servicoA.numeroReservas = 1
    servicoA.militaresInscritos = listamilitares
    servicoA.estado = 'ativo'
    servicoA.tipoDias = 'a'
    servicoA.dataInicio = new Date()
    servicoA.diadecalculo = 'diario'
    //servicoB
    servicoB.nome = 'Sargento de Dia B'
    servicoB.diasFolga = 1
    servicoB.tipoServico = 'rotina'
    servicoB.numeroNomeados = 1
    servicoB.numeroReservas = 1
    servicoB.militaresInscritos = listamilitares
    servicoB.estado = 'ativo'
    servicoB.tipoDias = 'b'
    servicoB.dataInicio = new Date()
    servicoB.diadecalculo = 'diario'

    await ServicoRepository.SaveServico(servicoA).catch(err=> {console.log(err)})
    await ServicoRepository.SaveServico(servicoB).catch(err=> {console.log(err)})

    var listaservicos = []
    let servicoTemp = await ServicoRepository.GetServicoByNome(servicoB.nome).catch(err=> {console.log(err)})
    listaservicos.push(servicoTemp.id)
    let servicoTemp2 = await ServicoRepository.GetServicoByNome(servicoA.nome).catch(err=> {console.log(err)})
    listaservicos.push(servicoTemp2.id)

    /*
    * CRIANDO UNIDADE
    */
    console.log('Criando a unidade.....OK!')

    let unidade = await UnidadeRepository.GetUnidade().catch(err => { console.log(err) });

    console.log(unidade)
    if (unidade) {
        console.log('unidade já existe')
    } else {
        unidade = new Unidade()
        unidade.listaServicos = listaservicos
        unidade.estadoAlerta = 'D'
        UnidadeRepository.SaveUnidade(unidade).catch(err=> {console.log(err)})
    }
    //FIM boot
    console.log('Finalizado boot.....OK!')
}

testing = async function () {
    const User = require('../models/user')
    const UserRepository = require('../repository/user.repository')

    let user = new User()
    user.nim = 'A1'
    user.email = '1050475@mail.exercito.pt'
    user.password = '12345'

    UserRepository.SaveUser(user)
}

//when the server starts...
// GestorDeEscalas.atualizaInfoDias()
// booting()
// testing()
