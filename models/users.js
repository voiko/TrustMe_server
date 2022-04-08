const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // in order to not save on database same email 
    },
    password: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true

    },
    lastName: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)