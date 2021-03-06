const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const cors = require('cors')
var path = require('path');

const port = process.env.PORT
const uri = process.env.ATLAS_URI

app.use(cors())

// body-parser
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb'
}))
app.use(bodyParser.json())

app.set('view engine', 'ejs');

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + "/public"));

// routes
const authRouter = require('./routes/auth_route')
app.use('/api/users', authRouter)


const tradeRouter = require('./routes/trade_route');
app.use('/api/contracts', tradeRouter);

const recommendationRouter = require('./routes/recommendation_route');
app.use('/api/recommendation', recommendationRouter);

app.post('/escrow', (req, res) => {
    const payload = req.body;
    console.log(payload);
    res.render('escrow', {details: payload});
})

app.post('/viewContract',(req,res)=>{
    const payload = req.body;
    console.log(payload);
   res.render('viewContract',{details:payload});
})

app.post('/setAgreement',(req,res)=>{
    const payload = req.body;
    console.log(payload);
   res.render('setAgreement',{details:payload});
})

const homeRouter = require('./routes/home_route')
app.use('/home', homeRouter)

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

module.exports = app