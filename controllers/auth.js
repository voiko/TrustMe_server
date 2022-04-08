const User = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const sendError = (res, code, message) => {
    return res.status(code).send({
        'status': 'failed',
        'error': message
    })
}

// ** SignUp **
const signup = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const birthday = req.body.birthday
    const phoneNumber = req.body.phoneNumber

    try {
        const exists = await User.findOne({
            'email': email
        })
        if (exists != null) {
            return sendError(res, 400, 'user already exists')
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = new User({
            'email': email,
            'password': hashPassword,
            'confirmPassword': confirmPassword,
            'firstName': firstName,
            'lastName': lastName,
            'birthday': birthday,
            'phoneNumber': phoneNumber
        })
        console.log('User registered and save to database. ');
        // newUser = await user.save();
        // res.status(200).send(newUser)

        const newUser = await user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User Created!',
                    result: result
                })
            }).catch(err => {
                res.status(500).json({
                    'error': err
                })
            })
    } catch (err) {
        sendError(res, 400, err.message)
    }
}

// ** LOGIN **
const login = async (req, res, next) => {

    const email = req.body.email
    const password = req.body.password

    if (email == null || password == null) return sendError(res, 400, 'Invalid email or password')
    try {
        const user = await User.findOne({
            'email': email
        })
        if (user == null) return sendError(res, 400, 'Invalid email or password')

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return sendError(res, 400, 'Invalid email or password')
        }

        const accessToken = await jwt.sign({
                '_id': user._id
            },
            process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: process.env.JWT_TOKEN_EXPIRATION
            }
        )
        console.log('A user is logged in.');

        res.status(200).send({
            'accessToken': accessToken
        })

    } catch (err) {
        sendError(res, 400, err.message)
    }
}

// ** LOGOUT **
const logout = async (req, res, next) => {
    try {
        res.cookie('jwt', 'logout', {
            expires: new Date(Date.now() + 5 * 1000),
            httpOnly: true
        });
        res.status(200).send({
            'status': 'user logged out successfully'
        });
    } catch (err) {
        sendError(res, 400, err.message);
    }
}

const getUsers = async (req, res, next) => {
    try {
        users = await User.find()
        res.status(200).send(users)

    } catch (err) {
        sendError(res, 400, err.message)
    }
}

const getUserById = async (req, res, next) => {
    try {
        user = await User.findById(req.params.id)
        res.status(200).send(user)

    } catch (err) {
        sendError(res, 400, err.message)
    }
}

module.exports = {
    login,
    signup,
    logout,
    getUsers,
    getUserById
}