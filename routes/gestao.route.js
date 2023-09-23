const express = require('express')
const router = express.Router()

const gestao_controller = require('../controllers/gestao.controller')

//diaB
// router.post('/diab/create', gestao_controller.adicionar_diab)
// router.delete('/diab/', gestao_controller.remover_diab_byID)
// router.get('/diab/', gestao_controller.todos_diasb)

//militar
//Todos militares
router.get('/militar', gestao_controller.todos_militares)
router.get('/militar/:id', gestao_controller.get_militarbyid)

//Criar militar
router.post('/militar/create', gestao_controller.adicionar_militar)
router.delete('/militar/:id', gestao_controller.delete_militar)
// router.delete('/militar/', gestao_controller.remover_militar_byNIM)

//Editar estado militar
router.put('/militar/:id', gestao_controller.editar_militar)

//unidade
// router.post('/unidade', gestao_controller.ordenar_servicos)

//diasb
router.post('/diasb', gestao_controller.inserirDiasB)

//infodia
// router.post('/infodia/diasb', gestao_controller.diasb)
router.post('/infodia/indisponiveis', gestao_controller.militaresIndisponiveisNumPeriodo)

module.exports = router;