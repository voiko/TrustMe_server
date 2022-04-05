const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: false

    },
    lastName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: false
    },
    birthday: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('User', userSchema)