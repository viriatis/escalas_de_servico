const express = require('express')
const router = express.Router()

const telegram_controller = require('../controllers/telegram.controller')

router.post('/', telegram_controller.mandarMensagem)


module.exports = router;