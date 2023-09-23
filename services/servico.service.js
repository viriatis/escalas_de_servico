// //
// exports.adicionar_servico

// exports.remover_servico

// exports.getServico

// exports.inscrever_militares_servico

// exports.remover_militares_servico

// //CONEXÃO API 1
// exports.militares_indisponiveisNumDia

// //Simular API, input ficheiro csv
// exports.militares_indisponiveisNumDiaCSV

const Servico = require('../models/servico');
const ServicoRepository = require('../repository/servico.repository');
const MilitarRepository = require('../repository/militar.repository');

exports.adicionar_servico = async function(body){

    var servico = new Servico();

    servico.nome = body.nome
    servico.tipoServico = body.tipoServico
    servico.numeroNomeados = body.numeroNomeados
    servico.numeroReservas = body.numeroReservas
    servico.tipoDias = body.tipoDias
    servico.diadecalculo = body.diadecalculo
    servico.estado = body.estado
    servico.militaresInscritos = body.militaresInscritos
    servico.dataInicio = body.dataInicio

    let newServico = await ServicoRepository.SaveServico(servico).catch(err => { return {erro: err} });

    return newServico
}

exports.inscrever_militares = async function(id, body){

    let servico = await ServicoRepository.GetById(id).catch(err => { return {erro: err} });
    if(servico){
        servico.militaresInscritos = body.militaresInscritos
        var hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        servico.dataAtualizacaoOrdemManual = hoje;
    
        let newServico = await ServicoRepository.UptadeServico(servico).catch(err => { return {erro: err} }); 
        return newServico
    }else{
        return false
    }
    

   
}

exports.todos_servicos = async function(){
    let todosServicos = await ServicoRepository.TodosServicos().catch(err => { return {erro: err} });

    return todosServicos;
   
}

exports.delete_servico = async function(id){
    let servico = await ServicoRepository.DeleteServico(id).catch(err => { return {erro: err} });
    
    return servico
}

exports.get_servicobyid = async function(id){
    let servico = await ServicoRepository.GetById(id).catch(err => { return {erro: err} });

    let militares = []
    if(servico.militaresInscritos){
        for(let i = 0; i < servico.militaresInscritos.length; i++){
            let militar = await MilitarRepository.GetById(servico.militaresInscritos[i]).catch(err=>{ console.log(err)})
            console.log(militar)
            militares.push(militar.nim)
        }
    }

    console.log(militares)
    
    
    return {
        nome: servico.nome,
        numeroNomeados: servico.numeroNomeados,
        numeroReservas: servico.numeroReservas,
        tipoDias: servico.tipoDias,
        diasFolga: servico.diasFolga,
        estado: servico.estado,
        dataInicio: servico.dataInicio,
        diadecalculo: servico.diadecalculo,
        militaresInscritos: militares
    }
}


exports.getServicosPorMilitar = async function(id){
    console.log("id", id)
    let listaServicos = await ServicoRepository.getServicosPorMilitar(id).catch(err => { return {erro: err} });
    let lista = []
    console.log(listaServicos)
    if(listaServicos){
        
        for(let i in listaServicos){
            aux={
                id: listaServicos[i].id,
                nome: listaServicos[i].nome
            }
            lista.push(aux)
        }

        
    }
    console.log(lista)
    return lista
    
}