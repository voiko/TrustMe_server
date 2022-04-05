const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT
const uri = process.env.ATLAS_URI

// body-parser
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb'
}))
app.use(bodyParser.json())

const authRouter = require('./routes/auth_route')
app.use('/auth', authRouter)

module.exports = app