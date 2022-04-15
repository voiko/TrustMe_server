const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
    side: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    deposit: {
        type: Number,
        required: true
    },
    emailOfAnotherSide: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('Trade', tradeSchema)