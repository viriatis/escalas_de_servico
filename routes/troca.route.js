const express = require('express')
const router = express.Router()

const troca_controller = require('../controllers/troca.controller')

router.post('/create', troca_controller.adicionar_troca)
router.get('/militar/:id', troca_controller.trocasbyMilitar)
router.get('/', troca_controller.todas_trocas)
router.delete('/:id', troca_controller.delete_troca)

module.exports = router;