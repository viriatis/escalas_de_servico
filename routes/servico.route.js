const express = require('express')
const router = express.Router()

const servico_controller = require('../controllers/servico.controller')

router.post('/create', servico_controller.criar_servico)
router.get('/', servico_controller.todos_servicos)
router.get('/:id', servico_controller.getservicobyid)
router.delete('/:id', servico_controller.apagar_servico)

//inscrever militares substitui os militares (demo)
router.put('/:id/inscreverMilitares', servico_controller.inscrever_militares)
// router.put('/:id/retirarMilitares', servico_controller.remover_militares_servico)
router.get('/militar/:id', servico_controller.getServicosPorMilitar)

module.exports = router;