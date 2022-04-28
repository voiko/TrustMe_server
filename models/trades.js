const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    deposit: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    buyerId: {
        type: String,
        required: false
    },
    sellerId: {
        type: String,
        required: false
    },
})

module.exports = mongoose.model('Trade', tradeSchema)