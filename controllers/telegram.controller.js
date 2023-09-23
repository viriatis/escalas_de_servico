const Telegram = require('../services/telegram/telegram.bot')


exports.mandarMensagem = async (req, res) => {
    var success = await Telegram.sendMessage('961132772', req.body.text);

    if (success.erro) {
        res.status(400).send(success);
    } else if (success == null) {
        res.status(404).send(success);
    } else {
        res.status(201).send(success);
    }
}