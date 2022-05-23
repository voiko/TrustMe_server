const express = require('express')
const router = express.Router()
const Auth = require("../controllers/auth")

router.get('/users', Auth.getUsers)
router.post('/signup', Auth.signup)
router.post('/login', Auth.login)
router.post('/logout', Auth.logout)
router.get('/:id', Auth.getUserById)
router.get('/findUser', Auth.findUser)
router.post('/getUserDetailsByUserId', Auth.getUserDetailsByUserId)
router.post('/getUserDetailsByEmail', Auth.getUserDetailsByEmail)

module.exports = router