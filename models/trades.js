const mongoose = require('mongoose')

const tradeSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    depositSeller: {
        type: Number,
        required: true
    },
    depositBuyer: {
        type: Number,
        required: true
    },
    walletAddressSeller: {
        type: String,
        required: true
    },
    walletAddressBuyer: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    creator: { // who created this transaction
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // id belong to user who created this transaction
        required: true
    },
    status: { // status of transaction
        type: String,
        required: false
    },
    transactionID: {
        type: String,
    },
    buyerID: {
        type: String,
        required: true
    },
    status: { // status of transaction
        type: String,
        required: false
    },
    transactionID: {
        type: String,
    },
    buyerID: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tradeAddress: {
        type: String,
    },
    buyerPay: {
        type: Boolean,
        required: true
    },
    sellerPay: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Trade', tradeSchema)