const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
    messageFrom: {
        type: String,
        required: true
    },
    messageTo: {
        type: String,
        required: true
    },
    messageText: { // status of transaction
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Recommendation', recommendationSchema)