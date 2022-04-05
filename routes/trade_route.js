const express = require('express')
const router = express.Router()
const Trade = require('../controllers/trade')
const authenticate = require("../common/auth_middleware")


module.exports = router