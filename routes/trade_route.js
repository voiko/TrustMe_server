const express = require('express')
const router = express.Router()
const Trade = require('../controllers/trade')
const authenticate = require("../common/auth_middleware")

router.post('/add', Trade.add)
router.get('/getContracts', Trade.getContract)


module.exports = router