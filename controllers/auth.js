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
    const password = req.body.password

    try {
        const exists = await User.findOne({
            'email': req.body.email
        })
        if (exists != null) {
            return sendError(res, 400, 'user already exists')
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const user = new User({
            email: req.body.email,
            password: hashPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            birthday: req.body.birthday,
            phoneNumber: req.body.phoneNumber,
            created: req.body.created
        })

        console.log('User registered and save to database. ');

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
    let fetchedUser;
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const accessToken = jwt.sign({
                    email: fetchedUser.email,
                    userId: fetchedUser._id
                },
                process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: process.env.JWT_TOKEN_EXPIRATION
                });
            res.status(200).json({
                'accessToken': accessToken,
                expiresIn: 900,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            });
        });
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

const findUser = async (req, res, next) => {
    User.findOne({
        email: req.params.email,
    }).then((user) => {
        res.status(200).json(user)
    }).catch((err) => {
        console.log("faild to find user.");
    })
}

module.exports = {
    login,
    signup,
    logout,
    getUsers,
    getUserById,
    findUser
}