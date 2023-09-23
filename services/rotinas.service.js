var CronJob = require('cron').CronJob;
const GestorDeEscalas = require('../services/gestordeescalas.service')

//Msg
console.log('Rotinas ativadas..........OK')

//rotinas
var rotina_atualizarInfoDias = new CronJob({

    cronTime: '0 6 * * *',
    onTick: function () {
        console.log('\nRotina de atualização de InfoDias de um periodo\n');

        GestorDeEscalas.atualizaInfoDias()

    },
    timeZone: ''

});

// rotina_atualizarInfoDias.start();

var rotina_api = new CronJob({

    cronTime: '* * * * *',
    onTick: function () {
        console.log('\nRotina de atualização de nomeações para ativo\n');

        GestorDeEscalas.atualizarNomeacoesParaAtivo().then(result => {
            console.log('Status Atualização Nomeações para Ativo: ', result)

            GestorDeEscalas.atualizarNomeacoesParaCumprido().then(result2 => {
                console.log('Status Atualização Nomeações para Cumprido: ', result2)

                GestorDeEscalas.calcularNomeacoesEscalaServicos().then(result3 => {
                    console.log('Status cálculo Nomeações Escala Serviço: ', result3)
                }).catch(err => { console.log(err) })
            }).catch(err => { console.log(err) })
        }
        ).catch(err => { console.log(err) })

    },
    timeZone: ''

});

// rotina_api.start()

// rotina_atualizarNomeacoesParaAtivo.start();
// GestorDeEscalas.atualizarNomeacoesParaAtivo();
// GestorDeEscalas.atualizarNomeacoesParaCumprido()
// GestorDeEscalas.calcularNomeacoesEscalaServicos()

iniciar = async function () {
    // GestorDeEscalas.atualizaInfoDias().then(result => {
        GestorDeEscalas.atualizarNomeacoesParaAtivo().then(result => {
            GestorDeEscalas.atualizarNomeacoesParaCumprido().then(result => {
                GestorDeEscalas.calcularNomeacoesEscalaServicos()
            }).catch(err => { console.log(err) })
        }
        ).catch(err => { console.log(err) })
    // })

}

iniciar()

