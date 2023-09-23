const express = require('express')
const router = express.Router()

const nomeacao_controller = require('../controllers/nomeacao.controller')

router.get('/all', nomeacao_controller.todas_nomeacoes)
router.get('/:id', nomeacao_controller.getNomeacaoById)
router.get('/militar/:id', nomeacao_controller.getNomeacaoPorMilitar)

router.post('/servico/:id', nomeacao_controller.ativarnomeacaoeventual)
router.get('/:id/ativar', nomeacao_controller.ativarnomeacaoprevencao)
router.put('/:id/manual', nomeacao_controller.editarnomeacao)

module.exports = router;