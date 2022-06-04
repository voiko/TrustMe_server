const express = require('express')
const router = express.Router()
const Trade = require('../controllers/trade')
const authenticate = require("../common/auth_middleware")

router.post('/add', authenticate, Trade.add)
router.get('/getNewContractByUserId', authenticate, Trade.getNewContractByUserId)
router.get('/getHistoryByUserId', authenticate, Trade.getHistoryByUserId)
router.post('/getHistoryByEmail', authenticate, Trade.getHistoryByEmail)
router.post('/getNewContractByEmail', authenticate, Trade.getNewContractByEmail)
router.get('/getContracts', authenticate, Trade.getContract)
router.post('/updateContract', authenticate, Trade.updateContract)
router.post('/setAgreement', authenticate, Trade.setAgreement)
router.put('/:id', authenticate, Trade.editContract)
router.delete('/:id', authenticate, Trade.cancelContract)

module.exports = router