const router = require('express').Router()
const authModule = require('../modules/Auth')()

router.post('/refresh', authModule.onRefresh())

router.get('/test', (req, res) => {
    res.status(200).json({q: 123})
})


module.exports = router