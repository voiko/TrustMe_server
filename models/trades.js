const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
    tradeId: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: false
    },
    buyerId: {
        type: String,
        required: true
    },
    sellerId: {
        type: String,
        required: true
    },
    deposit: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Trade', tradeSchema)