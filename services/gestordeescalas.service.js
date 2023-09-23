const InfoDia = require('../models/infodia')
const InfoDiaRepository = require('../repository/infodia.repository')
const config = require('../config'); // get our config file
const Nomeacao = require('../models/nomeacao')
const NomeacaoRepository = require('../repository/nomeacao.repository')
const ServicoRepository = require('../repository/servico.repository')
const AgNomeacaoTrocaRepository = require('../repository/agnomeacaotroca.repository')
const TrocaRepository = require('../repository/troca.repository')
const MilitarRepository = require('../repository/militar.repository')
const Agnomeacaotroca = require('../models/agnomeacaotroca')
const TrocaService = require('../services/troca.service')

const UnidadeRepository = require('../repository/unidade.repository')

limparListaInfoDias = async function (listaInfoDias) {
    for (let i = 0; i < listaInfoDias.length; i++) {
        listaInfoDias[i].listaImpedidosEscala = []
        listaInfoDias[i].listaFolgaPrevista = listaFolgaPrevista = []
    }

    return listaInfoDias
}

gravarInfoDias = async function (listaInfoDias) {
    for (let i = 0; i < listaInfoDias.length; i++) {
        InfoDiaRepository.UptadeInfoDia(listaInfoDias[i]).catch(err => {
            console.log(err)
        })
    }
}


/*
*  AtualizaInfoDias
*   
*   Através de um GET, faz pedido à API Gestão Recursos Humanos para atualizar
*   a lista de militares indisponiveis de cada InfoDia num periodo
*
*   Como API GRH não faz parte do projeto, pode ser recebido através de um ficheiro JSON
*/
exports.atualizaInfoDias = async function () {
    await atualizarDiasB(config.periodoInfoDias)
    //verifica que militares estão indisponiveis nos proximos dias através da api externa
    // let listadiasinfo = await RestServices.importFromExternalApi("GET",config.ApiExternaURL, config.ApiExternaGetInfoMilitares, config.periodoInfoDias)

    // listadiasinfo.forEach(function(dia) {
    //     InfoDiaRepository.GetInfoDiaByData(dia.data).then(
    //         infodia=>{
    //             infodia.concat(dia.listaIndisponiveis)
    //             InfoDiaRepository.UptadeInfoDia(infodia);
    //         }
    //     ).catch(err=>{console.log(err)})
    // });
}



atualizarDiasB = async function (numDias) {
    console.log('Atualizando dias B para os proximos ' + numDias + ' dias')
    var hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    var numDias = numDias;

    for (i = 0; i < numDias; i++) {
        let temp = new Date()
        temp.setDate(hoje.getDate() + i)

        let infodiatemp = new InfoDia()

        infodiatemp.data = temp

        if (temp.getDay() == 6 || temp.getDay() == 0) {
            infodiatemp.diaB = true
        } else {
            infodiatemp.diaB = false
        }

        await InfoDiaRepository.SaveInfoDia(infodiatemp).catch(err1 => { console.log(err1) })
    }
}


//atualizar nomeações para ativas
exports.atualizarNomeacoesParaAtivo = async function () {
    //carrega unidade da base de dados
    var unidade = await UnidadeRepository.GetUnidade().catch(err => { return err });
    if (!unidade) return false

    //lista ordenada de serviços
    let listaservicos = unidade.listaServicos;

    //para cada serviço
    for (let i = 0; i < listaservicos.length; i++) {
        let servico = await ServicoRepository.GetById(listaservicos[i]).catch(err => { return err });
        let listaMilitares = servico.militaresInscritos
        let hoje = new Date()
        hoje.setHours(0, 0, 0, 0)

        //serviços de prevenção são ativados manualmente
        if (servico.tipoServico != 'prevencao') {
            let listanomeacoes = await NomeacaoRepository.getNomeacoesPorServicoDataEstado(servico.id, 0, hoje, 'nomeado').catch(err => { return err });

            //para cada nomeação de um serviço
            if (listanomeacoes) {
                for (let j = 0; j < listanomeacoes.length; j++) {
                    let nomeacao = listanomeacoes[j];
                    nomeacao.estado = 'ativo'

                    //coloca os nomeados do serviço, no fim da lista
                    listaMilitares = await atualizarOrdemServico(listaMilitares, nomeacao.listaNomeados)

                    let datainicial = new Date()
                    datainicial.setDate(nomeacao.data.getDate())
                    datainicial.setHours(0, 0, 0, 0)
                    let diasAtividade = servico.diasAtividade
                    datainicial.setDate(datainicial.getDate() + diasAtividade)
                    let datafinal = new Date()
                    datafinal.setDate(datainicial.getDate() + servico.diasFolga)
                    datafinal.setHours(0, 0, 0, 0)

                    let listainfodias = await InfoDiaRepository.GetInfoDiasDumPeriodo(datainicial, datafinal).catch(err => { return err });

                    /*
                    * Efetiva as folgas dos nomeados a cumprir o serviço
                    */
                    for (let w = 0; w < listainfodias.length; w++) {
                        let infodia = listainfodias[w]
                        infodia.listaFolgaAtiva.push(nomeacao.listaNomeados)

                        await InfoDiaRepository.UptadeInfoDia(infodia).catch(err => { return err });
                    }

                    let listaagnomeacaotroca = await AgNomeacaoTrocaRepository.GetAgNomeacaoTrocaByNomeacao(nomeacao).catch(err => { return err });

                    //verifica se há trocas associadas
                    //se já houve troca e distroca, a troca passa para cumprida
                    //se a troca está agregada com duas nomeações cumpridas, então já foi cumprida
                    if (listaagnomeacaotroca) {
                        for (let w = 0; w < listaagnomeacaotroca.length; w++) {
                            let agNomeacaoTroca = listaagnomeacaotroca[w]

                            let agregadosTroca = await AgNomeacaoTrocaRepository.GetAgNomeacaoTrocaByTroca(agNomeacaoTroca.troca).catch(err => { return err });

                            if (agregadosTroca && agregadosTroca.length == 2) {
                                await TrocaService.trocaEstadoSeguinte(troca)
                            }
                        }
                    }
                    await NomeacaoRepository.UptadeNomeacao(nomeacao).catch(err => { return err });
                }
            }
        }
        servico.militaresInscritos = listaMilitares
        //guarda a ordem dos militares nesse serviço
        await ServicoRepository.UptadeServico(servico).catch(err => { return err });
    }
}


atualizarOrdemServico = async function (militares, nomeados) {

    for (let i = 0; i < nomeados.length; i++) {
        militares.push(militares.splice(militares.indexOf(nomeados[i]), 1)[0]);
    }

    return militares
}


//atualizar nomeações para cumpridas
exports.atualizarNomeacoesParaCumprido = async function () {
    var unidade = await UnidadeRepository.GetUnidade().catch(err => { return err });
    if (!unidade) return false
    let listaservicos = unidade.listaServicos;

    let hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    //no mínimo o dia seguinte é o primeiro dia possível de o serviço expirar
    let ontem = new Date()
    ontem.setDate(hoje.getDate() - 1)

    for (let i = 0; i < listaservicos.length; i++) {
        let servico = await ServicoRepository.GetById(listaservicos[i]).catch(err => { return err });
        if (servico.tipoServico != 'prevencao') {
            //todas as nomeações ativas com data de inicio até ao dia anterior
            let listanomeacoes = await NomeacaoRepository.getNomeacoesPorServicoDataEstado(servico.id, 0, ontem, 'ativo').catch(err => { return err });

            if (listanomeacoes) {
                for (let j = 0; j < listanomeacoes.length; j++) {
                    let nomeacao = listanomeacoes[j]
                    /*
                    *   Se a nomeação tiver mais de 1 dia, deve-se verificar esta expirou a atividade. "diasdeAtividade"
                    */

                    if (nomeacao.expira <= hoje) {
                        nomeacao.estado = 'cumprido'
                        await NomeacaoRepository.UptadeNomeacao(nomeacao).catch(err => { return err });
                    }

                    await NomeacaoRepository.GetById(nomeacao.id)
                }
            }
        }
    }
}


/*
*   Cálculo de nomeações e reservas das escalas de serviço
*/
exports.calcularNomeacoesEscalaServicos = async function () {
    //Variáveis necessárias
    var hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    /*
    *   Passo 1: Limpar listas dinâmicas das informações diárias
    */
    var listaInfoDias = await InfoDiaRepository.GetInfoDiasDumNumDias(config.periodoInfoDias)
    listaInfoDias = await limparListaInfoDias(listaInfoDias)
    gravarInfoDias(listaInfoDias)

    //ordena lista de infodias por data
    listaInfoDias.sort(function (a, b) {
        var dateA = new Date(a.data), dateB = new Date(b.data);
        return dateA - dateB;
    });

    /*
    *   Passo 2: Eliminar todas as previsões de troca
    */
    await eliminarPrevisoesDeTroca();

    let unidade = await UnidadeRepository.GetUnidade().catch(err => (console.log(err)))
    if (unidade) {
        //Se a lista de serviços existe e se é maior que zero
        if (unidade.listaServicos && unidade.listaServicos.length > 0) {
            let servicos = unidade.listaServicos
            /*
            *   Passo 3: Calcular Nomeacoes
            */
            for (let i = 0; i < servicos.length; i++) {
                let servico = await ServicoRepository.GetById(servicos[i]).catch(err => (console.log(err)))
                //Para calcular a escala, no mínimo tem de haver militares inscritos que preencham numero de nomeados e reservas
                if (servico && (servico.numeroNomeados + servico.numeroReservas) < servico.militaresInscritos.length) {

                    //serviços eventuais são calculados aquando ativação do utilizador
                    if (servico.tipoServico != 'eventual' && servico.estado == 'ativo') {
                        //SERVIÇOS DE ROTINA
                        if (servico.tipoServico == 'rotina') {
                            await nomeacoesServicoRotina(servico)
                        }
                        //SERVIÇOS DE PREVENÇÃO
                        // if (servico.tipoServico == 'prevencao') {
                        //     await nomeacoesServicoPrevencao(servico)
                        // }
                    }
                }
            }
            /*
            *   Passo 4: Calcular Reservas
            */
            for (let i = 0; i < servicos.length; i++) {
                let servico = await ServicoRepository.GetById(servicos[i]).catch(err => (console.log(err)))
                if (servico && (servico.numeroNomeados + servico.numeroReservas) < servico.militaresInscritos.length) {

                    if (servico.tipoServico != 'eventual' && servico.estado == 'ativo') {
                        if (servico.tipoServico == 'rotina') {
                            await reservasServicoRotina(servico)
                        }

                        // if (servico.tipoServico == 'prevencao') {
                        //     await reservasServicoPrevencao(servico)
                        // }
                    }
                }
            }
        }
    }

    return 0
}

/*
*   Para os serviços de rotina o calculo é diário e interessa saber que tipo de dia pertence
*   a escala interessa (tipos de dia: 'a', 'b' ou 'ambos')
*/
nomeacoesServicoRotina = async function (servico) {
    let ordemMilitares = servico.militaresInscritos
    let infodias = await InfoDiaRepository.GetInfoDiasDumNumDias(config.periodoInfoDias).catch(err => { return err })
    console.log(servico.nome)
    for (let i = 0; i < config.periodoCalculoEscala; i++) {
        //se serviço é para ser calculado em dias B
        if (infodias[i].diaB && servico.tipoDias != 'a') {
            let result = await novaNomeacaoRotina(servico, ordemMilitares, infodias, i)
            ordemMilitares = result.ordemMilitares
            infodias = result.infodias

            //se serviço é pode ser calculado em dias A
        } else if (!infodias[i].diaB && servico.tipoDias != 'b') {
            let result = await novaNomeacaoRotina(servico, ordemMilitares, infodias, i)
            ordemMilitares = result.ordemMilitares
            infodias = result.infodias
        }
    }

    await gravarInfoDias(infodias);
}

novaNomeacaoRotina = async function (servico, ordemMilitares, infodias, indexDiaAtual) {
    let numNomeados = servico.numeroNomeados
    let diasFolga = servico.diasFolga
    let diaAtual = infodias[indexDiaAtual]

    /*
    *   PASSO 1: Verificar se existe já uma nomeação para dia atual neste serviço
    */
    var nomeacaoExiste = await NomeacaoRepository.GetNomeacaoPorDataEServico(infodias[indexDiaAtual].data, servico.id).catch(err => { console.log(err) })

    if (nomeacaoExiste) {
        //se a nomeação existente foi editada manualmente ou está ativa, não se pode alterar esta nomeação
        if (nomeacaoExiste.estado == 'editado' || nomeacaoExiste.estado == 'ativo' //não mexe em nomeações ativas ou editadas
        ) {
            return { ordemMilitares: ordemMilitares, infodias: infodias }
        }
    }

    let nomeacao = new Nomeacao()
    nomeacao.data = new Date(diaAtual.data.valueOf())
    nomeacao.expira = new Date(diaAtual.data.valueOf())
    nomeacao.expira = nomeacao.expira.setDate(nomeacao.expira.getDate() + servico.diasAtividade)
    


    nomeacao.servico = servico.id
    /*
    *   PASSO 2: procura militares eligíveis de ser nomeados
    */

    let ciclos = 0
    do {
        for (let j = 0; j < ordemMilitares.length; j++) {
            if (numNomeados == 0) {
                break;
            }
            let militarid = ordemMilitares[j]
            //verificar se o militar está em nomeações ativas
            let nomeacoes = await NomeacaoRepository.GetNomeacoesAtivasNumaDataPorMilitar(diaAtual.data, militarid).catch(err => { console.log(err) })
            if (!nomeacoes || nomeacoes.length == 0) {
                let militar = await MilitarRepository.GetById(militarid).catch(err => { console.log(err) })
                if (militar && militar.estado == 'disponivel') {

                    if (!infodias[indexDiaAtual].listaIndisponiveis.includes(militarid) //verifica se está disponível no dia
                        && !infodias[indexDiaAtual].listaImpedidosEscala.includes(militarid) //verifica se não está escalado no dia atual
                        && !infodias[indexDiaAtual + 1].listaImpedidosEscala.includes(militarid)) { //verifica se há nomeaçoes consecutivas

                        if ((!infodias[indexDiaAtual].listaFolgaPrevista.includes(militarid) //verifica se há folgas previstas
                            && !infodias[indexDiaAtual].listaFolgaAtiva.includes(militarid)) //se há folgas ativas
                            || ciclos > 0) { //se não há mesmo militares disponíveis, terão de ser nomeados militares de folga
                            nomeacao.listaNomeados.push(militarid)
                            ordemMilitares = await colocarMilitarNoFim(ordemMilitares, militarid)

                            numNomeados = numNomeados - 1
                            //a posição onde estava a militar, tem agora um outro militar que viria a seguir
                            j = j - 1

                            //o militar fica impedido de fazer pertencer a outra nomeações
                            infodias[indexDiaAtual].listaImpedidosEscala.push(militarid)
                            //folgas previstas para o militar 
                            for (let j = 0; j < diasFolga; j++) {
                                //indexDiaAtual + Ndiafolga + 1 (começa a contar um dia após o serviço)
                                infodias[indexDiaAtual + j + 1].listaFolgaPrevista.push(militar)
                            }
                        }
                    }
                }
            }
        }
        ciclos = ciclos + 1
        //se já foram feitos dois ciclos, é porque não há mesmo militares disponíveis para a nomeação
    } while (numNomeados != 0 || ciclos == 2)

    /* 
    *   PASSO 3
    *   Verificar se há trocas ou distrocas pendentes
    *   O militar que troca não pode estar em nomeações ativas ou na lista de impedidos de escala deste dia
    *   ou na lista de indisponiveis deste dia
    * 
    *   Quando se agrega a troca com a nomeação, o militar que troca ou distroca, 
    *   entre na lista de impedidos de escala para não pode ser nomeado de novo nesta
    *   data  
    */
    if (nomeacaoExiste) {
        nomeacaoExiste.listaNomeados = nomeacao.listaNomeados
        await NomeacaoRepository.UptadeNomeacao(nomeacaoExiste).catch(err => { console.log(err) })
        infodias = await associarTrocasPendentesRotina(nomeacaoExiste, infodias, indexDiaAtual);
    } else {
        await NomeacaoRepository.SaveNomeacao(nomeacao)
        infodias = await associarTrocasPendentesRotina(nomeacao, infodias, indexDiaAtual);
    }

    return {
        ordemMilitares: ordemMilitares,
        infodias: infodias
    }
}

associarTrocasPendentesRotina = async function (nomeacao, infodias, indexDiaAtual) {

    for (let i = 0; i < nomeacao.listaNomeados.length; i++) {
        let nomeado = nomeacao.listaNomeados[i]
        //trocas em estado pendente, ou seja, em que o nomeado é o militar A
        let trocaspendentes = await TrocaRepository.GetTrocaByMilitarAEstadoPendentes(nomeacao.servico, nomeado).catch(err => { console.log(err) })
        //trocas em estado troca, ou seja, em que o nomeado é o militar B
        let distrocaspendentes = await TrocaRepository.GetTrocaByMilitarBEstadoTroca(nomeacao.servico, nomeado).catch(err => { console.log(err) })

        let trocas = []
        if (trocaspendentes && trocaspendentes.length > 0) {
            trocas = trocas.concat(trocaspendentes)
        }
        if (distrocaspendentes && distrocaspendentes.length > 0) {
            trocas = trocas.concat(distrocaspendentes)
        }

        if (trocas.length > 0) {
            //ordena trocas por data para usar a troca com mais antiguidade (se militar tiver disponibilidade)
            trocas.sort(function (a, b) {
                return new Date(a.data) - new Date(b.data)
            })

            for (let j = 0; j < trocas.length; j++) {
                let trocaAtiva = trocas[j]
                let militarParatrocar
                if (trocaAtiva.estado == 'pendente') {
                    militarParatrocar = trocaAtiva.militarB
                } else {
                    militarParatrocar = trocaAtiva.militarA
                }

                if (!nomeacao.listaNomeados.includes(militarParatrocar) && //verifica se não é um dos nomeados
                    !infodias[indexDiaAtual].listaIndisponiveis.includes(militarParatrocar) //verifica se está disponível no dia
                    && !infodias[indexDiaAtual].listaImpedidosEscala.includes(militarParatrocar)) {//verifica se não está escalado no dia atual
                    //verificar se o militarB está em nomeações ativas
                    let nomeacoes = await NomeacaoRepository.GetNomeacoesAtivasNumaDataPorMilitar(nomeacao.data, militarParatrocar).catch(err => { console.log(err) })
                    if (!nomeacoes || nomeacoes.length == 0) {
                        //Aqui militarParatrocar está provado como apto, então a troca é associada
                        infodias[indexDiaAtual].listaImpedidosEscala.push()

                        // await TrocaService.trocaEstadoSeguinte(trocaAtiva).catch(err => {console.log(err)})
                        if (trocaAtiva.estado == 'troca') {
                            trocaAtiva.estado = 'distroca'
                        } else if (trocaAtiva.estado == 'pendente') {
                            trocaAtiva.estado = 'troca'
                        }

                        let agregado = new Agnomeacaotroca()
                        agregado.nomeacao = nomeacao.id
                        agregado.troca = trocaAtiva.id

                        await AgNomeacaoTrocaRepository.SaveAgnomeacaotroca(agregado).catch(err => { console.log(err) })
                        await TrocaRepository.UptadeTroca(trocaAtiva).catch(err => { console.log(err) })
                    }
                }
            }
        }
    }
    return infodias
}

colocarMilitarNoFim = async function (militares, militar) {
    militares.push(militares.splice(militares.indexOf(militar), 1)[0]);
    return militares
}

eliminarPrevisoesDeTroca = async function () {
    let nomeacoesprevistas = await NomeacaoRepository.GetTodasNomeacoesPrevistas().catch(err => { console.log(err) });
    for (let i = 0; i < nomeacoesprevistas.length; i++) {
        let nomeacao = nomeacoesprevistas[i]
        //vai buscar todos agregados Nomeação-Troca 
        let agregados = await AgNomeacaoTrocaRepository.GetAgNomeacaoTrocaByNomeacao(nomeacao.id).catch(err => { console.log(err) });

        if (agregados && agregados.length > 0) {
            for (let j = 0; j < agregados.length; j++) {
                let ag = agregados[j]
                //muda o estado da troca para o anterior
                let troca = await TrocaRepository.GetById(ag.troca).catch(err => { console.log(err) });

                await TrocaService.trocaEstadoAnterior(troca)
                //elimina agregado Nomeação-Troca
                await AgNomeacaoTrocaRepository.DeleteAgnomeacaotroca(ag);
            }
        }
    }
}

/*
*   RESERVAS
*   RESERVAS SERVIÇOS DE ROTINA
*/
reservasServicoRotina = async function (servico) {
    let ordemMilitares = servico.militaresInscritos
    let infodias = await InfoDiaRepository.GetInfoDiasDumNumDias(config.periodoInfoDias).catch(err => { return err })
    console.log('Reservas: ', servico.nome)
    for (let i = 0; i < config.periodoCalculoEscala; i++) {
        //se serviço é para ser calculado em dias B
        if (infodias[i].diaB && servico.tipoDias != 'a') {

            let result = await reservasNomeacaoRotina(servico, ordemMilitares, infodias, i)
            ordemMilitares = result.ordemMilitares
            infodias = result.infodias

            //se serviço é pode ser calculado em dias A
        } else if (!infodias[i].diaB && servico.tipoDias != 'b') {

            let result = await reservasNomeacaoRotina(servico, ordemMilitares, infodias, i)
            ordemMilitares = result.ordemMilitares
            infodias = result.infodias
        }
    }
}


reservasNomeacaoRotina = async function (servico, ordemMilitares, infodias, indexDiaAtual) {
    let numeroReservas = servico.numeroReservas
    let diaAtual = infodias[indexDiaAtual]

    /*
    *   PASSO 1: Verificar se existe já uma nomeação para dia atual neste serviço
    */
    var nomeacaoExiste = await NomeacaoRepository.GetNomeacaoPorDataEServico(diaAtual.data, servico.id).catch(err => { console.log(err) })

    if (nomeacaoExiste) {
        //se a nomeação existente foi editada manualmente ou está ativa, não se pode alterar esta nomeação
        if (nomeacaoExiste.estado == 'editado' || nomeacaoExiste.estado == 'ativo') { //não mexe em nomeações ativas ou editadas
            //mudarordem do militar

            /*
            *       CODIGO DE ORDENAR ESCALA
            */

            return { ordemMilitares: ordemMilitares, infodias: infodias }
        } else {
            //atualiza nomeação

            let resultado = await militaresEligiveisReservas(servico, numeroReservas, ordemMilitares, infodias, indexDiaAtual).catch(err => { console.log(err) })
            if (resultado) {
                //os nomeados passam para o fim da lista pois, não podem ser reservas
                ordemMilitares = await atualizarOrdemServico(ordemMilitares, nomeacaoExiste.listaNomeados)
                nomeacaoExiste.listaReservas = resultado.militares
                await NomeacaoRepository.UptadeNomeacao(nomeacaoExiste).catch(err => { console.log(err) })

                return {
                    ordemMilitares: ordemMilitares,
                    infodias: infodias
                }
            } else {
                return {
                    ordemMilitares: ordemMilitares,
                    infodias: infodias
                }
            }
        }
    }
    console.log('AQUI')
}

militaresEligiveisReservas = async function (servico, numeronecessarios, ordemMilitares, infodias, indexDiaAtual) {
    let resultado = []
    /*
    *   PASSO 2: procura militares eligíveis de ser nomeados
    */

    let ciclos = 0
    do {
        for (let j = 0; j < ordemMilitares.length; j++) {
            if (numeronecessarios == 0) {
                break;
            }
            let militarid = ordemMilitares[j]
            //verificar se o militar está em nomeações ativas
            let nomeacoes = await NomeacaoRepository.GetNomeacoesAtivasNumaDataPorMilitar(infodias[indexDiaAtual].data, militarid).catch(err => { console.log(err) })
            if (!nomeacoes || nomeacoes.length == 0) {
                let militar = await MilitarRepository.GetById(militarid).catch(err => { console.log(err) })
                if (militar && militar.estado == 'disponivel') {

                    if (!infodias[indexDiaAtual].listaIndisponiveis.includes(militarid) //verifica se está disponível no dia
                        && !infodias[indexDiaAtual].listaImpedidosEscala.includes(militarid) //verifica se não está escalado no dia atual
                    ) { //verifica se há nomeaçoes consecutivas

                        if ((!infodias[indexDiaAtual].listaFolgaPrevista.includes(militarid) //verifica se há folgas previstas
                            && !infodias[indexDiaAtual].listaFolgaAtiva.includes(militarid)) //se há folgas ativas
                            || ciclos > 0) { //se não há mesmo militares disponíveis, terão de ser nomeados militares de folga

                            // if (infodias[indexDiaAtual + 1].listaImpedidosEscala.includes(militarid)) {
                            //     //buscar nomeação do militar do dia seguinte se existir
                            //     let nomeacao = await NomeacaoRepository.GetNomeacaoPorMilitarPorDataPorEstado(militarid, infodias[indexDiaAtual + 1].data, 'nomeado').catch(err => { console.log(err) })
                            //     //se existe, verificar se a prioridade do serviço dessa nomeação tem prioridade sobre o atual
                            //     if (nomeacao) {
                            //         let prioridade = await comparaPrioridadeServico(servico.id, nomeacao.servico).catch(err => { console.log(err) })
                            //         if (prioridade) {
                            //             resultado.push(militarid)
                            //             ordemMilitares = await colocarMilitarNoFim(ordemMilitares, militarid)

                            //             numeronecessarios = numeronecessarios - 1
                            //             //a posição onde estava a militar, tem agora um outro militar que viria a seguir
                            //             j = j - 1
                            //         }
                            //     }
                            // } else {
                            resultado.push(militarid)

                            numeronecessarios = numeronecessarios - 1
                            //a posição onde estava a militar, tem agora um outro militar que viria a seguir
                            j = j - 1
                            // }
                        }
                    }
                }
            }
        }
        ciclos = ciclos + 1
        //se já foram feitos dois ciclos, é porque não há mesmo militares disponíveis para a nomeação
    } while (numeronecessarios != 0 || ciclos == 2)

    return {
        ordemMilitares: ordemMilitares,
        militares: resultado
    }
}

comparaPrioridadeServico = async function (servico1id, servico2id) {
    let unidade = await UnidadeRepository.GetUnidade().catch(err => { })

    let listaServicos = unidade.listaServicos;

    if (listaServicos.includes(servico1id) && listaServicos.includes(servico2id)) {
        let indexA = listaServicos.indexOf(servico1id);
        let indexB = listaServicos.indexOf(servico2id);

        if (indexA > indexB) {
            return false
        }
    }

    return true
}

// comparaPrioridadeServico("5d78ffd84fcfc83718451e4b", "5d78ffd84fcfc83718451e4c").then(flag =>{
//     console.log(flag)
// })


/*
*
*   CÁLCULO SERVIÇOS PREVENÇÃO
*
*/
/*
*   Para os serviços de prevenção o cálculo pode ser diário ou apenas para um dia específico da semana.
*   O período da nomeação depende do número de dias de atividade definido no serviço.
*/
nomeacoesServicoPrevencao = async function (servico) {
    let ordemMilitares = servico.militaresInscritos
    let infodias = await InfoDiaRepository.GetInfoDiasDumNumDias(config.periodoInfoDias).catch(err => { return err })
    var listaDias = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado']

    let contar = 0;

    for (let i = 0; i < config.periodoCalculoEscala; i++) {
        //se o serviço é de escala de prevenção diária ou se o dia atual é o dia de cálculo de nomeação
        if (servico.diadecalculo == 'diario' || listaDias[infodias[i].getDay()] == servico.diadecalculo) {
            if (contar == 0) {
                /*
                *  PASSO 1: verificar última nomeação antes do primeiro dia e passar para cumprida
                *   
                */
                let nomeacoesanterioresporcumprir = await NomeacaoRepository.GetNomeacaoAnterioresParaCumprir(servico.id, hoje).catch(err => { return err })
                if (nomeacoesanterioresporcumprir && nomeacoesanterioresporcumprir.length > 0) {
                    for (let j = 0; j < nomeacoesanterioresporcumprir.length; j++) {
                        let nomeacao = nomeacoesanterioresporcumprir[j]

                        //trocar ordem e atualizar serviço
                        let servico = await ServicoRepository.GetById(nomecao.servico).catch(err => {console.log(err)})
                        servico.militaresInscritos = await atualizarOrdemServico(servico.militaresInscritos, nomeacao.listaNomeados)
                        await ServicoRepository.UptadeServico(servico).catch(err => {console.log(err)})

                        //atualizar estado e atualizar nomeação
                        nomeacao.estado = 'cumprido'
                        await NomeacaoRepository.UptadeNomeacao(nomeacao)
                    }
                }
            } else {
                let result = await novaNomeacaoPrevencao(servico, ordemMilitares, infodias, i)
                ordemMilitares = result.ordemMilitares
                infodias = result.infodias
            }
        }
    }

    await gravarInfoDias(infodias);
}

novaNomeacaoPrevencao = async function (servico, ordemMilitares, infodias, i) {

}