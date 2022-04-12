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

    },
    lastName: {
        type: String,
    },
    birthday: {
        type: Date,
        default: new Date()
    },
    created: {
        type: Date,
        default: new Date()
    },
    phoneNumber: {
        type: Number,
    },
    userID: {
        type: String,
    }
})

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('User', userSchema)