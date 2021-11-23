const router = require('express').Router()
const Login = require('../modules/Login')
const loginModule = new Login()

router.post('', loginModule.onPostLogin())
router.post('/logout', loginModule.onPostLogout())

module.exports = router