const express = require('express')
const router = express.Router()

const user_controller = require('../controllers/user.controller');


// a simple test url to check that all of our files are communicating correctly.
// router.get('/test', user_controller.test);

// router.post('/register', user_controller.user_create);
// router.post('/authenticate', user_controller.user_authentication);
// router.post('/login', user_controller.user_login);
// router.get('/verify', user_controller.user_emailverification);

router.post('/create', user_controller.criar_user)
router.get('/', user_controller.ver_users)
router.get('/:id', user_controller.get_userbyId)
router.put('/:id', user_controller.permissaoGestor)
router.delete('/:id', user_controller.apagar_user)

module.exports = router;