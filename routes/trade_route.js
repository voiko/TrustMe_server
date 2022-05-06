const express = require('express')
const router = express.Router()
const Trade = require('../controllers/trade')
const authenticate = require("../common/auth_middleware")

router.post('/add', authenticate, Trade.add)
router.get('/getContracts', authenticate, Trade.getContract)

module.exports = router