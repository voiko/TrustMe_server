const express = require('express')
const router = express.Router()
const Auth = require("../controllers/auth")

router.get('/users', Auth.getUsers)
router.post('/register', Auth.register)
router.post('/login', Auth.login)
router.post('/logout', Auth.logout)

module.exports = router