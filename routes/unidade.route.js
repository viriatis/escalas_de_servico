const express = require('express')
const router = express.Router()

const gestao_controller = require('../controllers/gestao.controller')

router.get('/', gestao_controller.getUnidade)
router.put('/editar', gestao_controller.editarUnidade)
router.put('/estadoalerta', gestao_controller.mudarestadoalerta)


module.exports = router;