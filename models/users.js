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
        required: false

    },
    lastName: {
        type: String,
        required: false
    },
    confirmPassword: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: false,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false
    }
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)