const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseDateFormat = require('mongoose-date-format');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // in order to not save on database same email 
        required: true

    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },
    created: {
        type: Date,
    },
    phoneNumber: {
        type: Number
    },
    userID: {
        type: String,
    }
})

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('User', userSchema)