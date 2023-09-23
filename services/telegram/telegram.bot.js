console.log('Telegram bot running....OK!')
var async = require('async');
var QRCode = require('qrcode');
var speakeasy = require('speakeasy');
const emailservice = require('../email/email.service')

process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
//@escala_pesti_bot
const token = '973319844:AAFqm2CEp88pRBBw8RdWaKNwbbBc_5ABu7U';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });


//imports
const MilitarRepository = require('../../repository/militar.repository')
const UnidadeRepository = require('../../repository/unidade.repository')
const UserRepository = require('../../repository/user.repository')
const TrocaRepository = require('../../repository/troca.repository')
const Troca = require('../../models/troca')
const User = require('../../models/user')

const MINUTOSLOGIN = 10

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});


// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  // bot.sendMessage(chatId, 'Comandos:\nRegistar: /registar $nim $password\nLogin: /login $nim $code\n');
  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
});

//REGISTAR USER
bot.onText(/\/registar (.+)/, (msg, match) => {

  var chatId = msg.chat.id;
  var array = match[1].split(' ') //nim + email
  console.log(array)

  if (array.length == 2) {
    MilitarRepository.GetMilitarByNIM(array[0]).then(
      militar => {
        if (militar) {

          UserRepository.GetUserByMilitarId(militar.id).then(user => {

            if (user) {

              if (user.passwordtelegram == array[1]) {
                console.log(chatId)
                if (user.chatid == chatId) {
                  resp = 'user já registado'
                  bot.sendMessage(chatId, resp)
                } else {
                  let secret = speakeasy.generateSecret({ length: 10, name: "ESCALASAPI" });
                  QRCode.toDataURL(secret.otpauth_url).then(
                    data_url => {
                      user.secret = {
                        base32: secret.base32,
                        expiration: new Date().setUTCSeconds(new Date().getUTCSeconds() + 300)
                      };

                      console.log('chegou acolá')
                      UserRepository.SaveUser(user).then(user => {
                        if (user) {
                          resp = 'sucess! Verifique email ' + militar.email

                          var html = '<html>Olá,<br> Telegram Bot Escalas Services<br>Usa o google authenticator para teres acesso aos servicos telegram! Obrigado.<body><img src='
                            + data_url + '></img></body></html>\r\n'

                          emailservice.emailUserHtml(militar.email, 'QRCODE Escalas Telegram', html)
                        } else {
                          resp = 'Utilizador já registado!'

                        }
                        bot.sendMessage(chatId, resp);
                      }).catch(err => { bot.sendMessage(chatId, err); })
                    }
                  ).catch(err => { return err });
                }
              } else {
                resp = 'Password errada. Violação reportada ao Exército Português'
                bot.sendMessage(chatId, resp)
              }


            } else {
              resp = 'Comunique com gestor de escalas para criar utilizador'
              bot.sendMessage(chatId, resp)
            }
          }).catch(err => { console.log(err) })

        } else {
          bot.sendMessage('Militar não existe! Violação reportada ao administrador!')
        }
      }
    ).catch(err => { bot.sendMessage('Erro no servidor') })

  } else {
    resp = '/registar nim password'
    bot.sendMessage(chatId, resp);
  }
});


//LOGIN USER
bot.onText(/\/login (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  var array = match[1].split(' ')

  if (array.length == 2) {
    MilitarRepository.GetMilitarByNIM(array[0]).then(militar => {
      if (militar) {
        UserRepository.GetUserByMilitarId(militar.id).then(user => {
          if (user) {
            console.log(user)
            var verified = speakeasy.totp.verify({
              secret: user.secret.base32,
              encoding: 'base32',
              token: array[1],
              window: 2
            })

            if (verified) {
              user.chatid = chatId
              var hoje = new Date()
              user.dataLogin = new Date(hoje.getTime() + MINUTOSLOGIN * 60000)
              resp = 'Login efetuado!'
              UserRepository.UpdateUser(user).then().catch(err => { console.log(err) })
            } else {
              resp = 'Acesso restrito a Militares Autorizados do Exército Português! Violação reportada!'
            }
            bot.sendMessage(chatId, resp);
          } else {
            resp = 'Erro: user não registado'
            bot.sendMessage(chatId, resp);
          }
        }).catch(err => { bot.sendMessage('erro no servidor') })
      }
    }).catch(err => { bot.sendMessage(chatId, 'Militar não existe') })
  } else {
    resp = '/login nim password'
    bot.sendMessage(chatId, resp)
  }
});

function checkIfLogon(chatId, callback) {
  UserRepository.GetUserByChatId(chatId).then(user => {
    var flag = false
    if (user && user.dataLogin > new Date()) {
      flag = true
    } else {
      flag = false
    }
    callback(null, flag, user)
  }).catch(err => { bot.sendMessage(chatId, 'erro na base de dados') })
}

//CHECK TEST USER LOGON
bot.onText(/\/teste/, (msg) => {

  const chatId = msg.chat.id;

  checkIfLogon(chatId, function (err, resposta, user) {

    if (!err) {
      if (resposta) {
        bot.sendMessage(chatId, 'User logado!')
      } else {
        bot.sendMessage(chatId, 'Registe-se ou faça login')
      }
    } else {
      bot.sendMessage(chatId, 'erro no servidor')
    }
  })
});

const NomeacaoRepository = require('../../repository/nomeacao.repository')
const ServicoRepository = require('../../repository/servico.repository')
//Saber suas nomeaçoes
bot.onText(/\/escala/, (msg) => {

  const chatId = msg.chat.id;

  checkIfLogon(chatId, function (err, resposta, user) {

    if (!err) {
      if (resposta) {

        getNomeacoes(user, chatId, function (err, resposta) {

          if (!err) {
            bot.sendMessage(chatId, resposta)
          } else {
            bot.sendMessage(chatId, 'erro no servidor')
          }
        })

      } else {
        bot.sendMessage(chatId, 'Registe-se ou faça login')
      }
    } else {
      bot.sendMessage(chatId, 'erro no servidor')
    }
  })
});

function getNomeacoes(user, chatId, callback) {

  MilitarRepository.GetById(user.militar).then(
    militar => {
      NomeacaoRepository.TodasNomeacoesMilitarNomeado(militar.id).then(
        listaNomeacoes => {
          async.each(listaNomeacoes, function (nomeacao, callback) {
            console.log(nomeacao)
            ServicoRepository.GetById(nomeacao.servico).then(servico => {
              var text = 'Data: ' + nomeacao.data.toDateString() + ' Servico: ' + servico.nome
              bot.sendMessage(chatId, text)
              callback()
            })
          }, function (err) {

          })
        }
      ).catch(err => {
        console.log(err)
        callback(null, 'erro no servidor1')
      })
    }
  ).catch(err => {
    callback(null, 'erro no servidor2')
  })

}

exports.sendMessage = function (chatId, message) {
  return bot.sendMessage(chatId, message)
}

bot.on("polling_error", (err) => console.log(err));


bot.onText(/\/menu/, (msg) => {

  const chatId = msg.chat.id;


  checkIfLogon(chatId, function (err, resposta, user) {

    if (!err) {
      if (resposta) {
        bot.sendMessage(chatId, 'Comandos:\nVer Nomeações: /escalas\nCriar Troca: /troca $serviço $NIM_segundomilitar\nTrocas a Confirmar: /trocas\nConfirmar Troca: /troca $código\nServiços: /servicos');

      } else {
        bot.sendMessage(chatId, 'Comandos:\nRegistar: /registar $nim $password\nLogin: /login $nim $code\nMenu: /menu');
      }
    } else {
      bot.sendMessage(chatId, 'erro no servidor')
    }
  })
});

//LOGIN USER
bot.onText(/\/troca (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  var array = match[1].split(' ')


  checkIfLogon(chatId, function (err, resposta, user) {

    if (!err) {
      if (resposta) {
        if (array.length == 2) {

          UserRepository.GetUserByChatId(chatId).then(user => {
            MilitarRepository.GetMilitarByNIM(array[1]).then(militarB => {
              UnidadeRepository.GetUnidade().then(unidade => {

                if (unidade.listaServicos[array[0]]) {
                  let servicoId = unidade.listaServicos[array[0]]
                  ServicoRepository.GetById(servicoId).then(servico => {
                    if (servico.militaresInscritos.includes(user.militar) && servico.militaresInscritos.includes(militarB.id)) {
                      let troca = new Troca()
                      troca.data = new Date()
                      troca.servico = servicoId
                      troca.militarA = user.militar
                      troca.militarB = militarB.id
                      troca.estado = 'porconfirmar'

                      TrocaRepository.SaveTroca(troca).then(result => {
                        bot.sendMessage(chatId, 'Troca criada com sucesso. O segundo militar deve confirmar a troca, veja: /trocas e confirme com /troca $codigo_troca')
                      })
                    } else {
                      bot.sendMessage(chatId, 'militar A ou militar B não pertence ao serviço proposto')
                    }
                  })
                }else{
                  bot.sendMessage(chatId, 'código de serviço não existe')
                }
              })
            })
          })
        } else if (array.length == 1) {
          UserRepository.GetUserByChatId(chatId).then(user => {
            TrocaRepository.GetTrocasPorConfirmarMilitarB(user.militar).then(lista => {
              if (lista[array[0]]) {
                let troca = lista[array[0]]
                troca.estado = 'pendente'

                TrocaRepository.UptadeTroca(troca).then(result => {
                  resp = 'Troca confirmada com sucesso'
                  bot.sendMessage(chatId, resp)
                }
                )
              }else{
                resp = 'Troca não existe'
                bot.sendMessage(chatId, resp)
              }
            })
          })

        }
        else {
          resp = '/troca $servico $nim_segundo_militar'
          bot.sendMessage(chatId, resp)
        }
      } else {
        bot.sendMessage(chatId, 'Comandos:\nRegistar: /registar $nim $password\nLogin: /login $nim $code\nMenu: /menu');
      }
    } else {
      bot.sendMessage(chatId, 'erro no servidor')
    }
  })
});

bot.onText(/\/trocas/, (msg) => {

  const chatId = msg.chat.id;


  checkIfLogon(chatId, function (err, resposta, user) {

    if (!err) {
      if (resposta) {
        TrocaRepository.GetTrocasPorConfirmarMilitarB(user.militar).then(listaTrocas => {
          console.log(listaTrocas)
          for (let i = 0; i < listaTrocas.length; i++) {
            let troca = listaTrocas[i]
            MilitarRepository.GetById(troca.militarA).then(militarA => {
              let resp = 'Código Troca: ' + i + '\nData: ' + troca.data.toLocaleDateString() + '\nMilitar A: ' + militarA.nim + '\nEstado: ' + troca.estado
              bot.sendMessage(chatId, resp)
            })
          }
        })
      } else {
        bot.sendMessage(chatId, 'Comandos:\nRegistar: /registar $nim $password\nLogin: /login $nim $code\nMenu: /menu');
      }
    } else {
      bot.sendMessage(chatId, 'erro no servidor')
    }
  })
});

exports.sendTelegramMessage = async function (chatId, message) {
  bot.sendMessage(chatId, message);

  return true
}


bot.onText(/\/servicos/, (msg) => {

  const chatId = msg.chat.id;


  checkIfLogon(chatId, function (err, resposta, user) {

    if (!err) {
      if (resposta) {

        ServicoRepository.getServicosPorMilitar(user.militar).then(lista => {

          UnidadeRepository.GetUnidade().then(unidade => {
            let texto = ''
            for (let i = 0; i < unidade.listaServicos.length; i++) {
              for (let j = 0; j < lista.length; j++) {
                if (lista[j].id == unidade.listaServicos[i]) {
                  texto += 'Código Serviço: ' + i + ' Nome: ' + lista[j].nome + '\n'
                }
              }
            }

            bot.sendMessage(chatId, texto)
          })
        })

      } else {
        bot.sendMessage(chatId, 'Comandos:\nRegistar: /registar $nim $password\nLogin: /login $nim $code\nMenu: /menu');
      }
    } else {
      bot.sendMessage(chatId, 'erro no servidor')
    }
  })
});