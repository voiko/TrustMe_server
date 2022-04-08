const express = require('express')
const router = express.Router()
const Auth = require("../controllers/auth")

router.get('/users', Auth.getUsers)
router.post('/signup', Auth.signup)
router.post('/login', Auth.login)
router.post('/logout', Auth.logout)
router.get('/:id', Auth.getUserById)

module.exports = router