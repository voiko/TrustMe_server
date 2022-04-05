const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeaders.split(' ')[1] // the field in the first place
    if (token == null) {
        return res.sendStatus(401).send();
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403).send(err.message)
        }
        req.user = user
        next() // call the next step in the middleware
    })
}

module.exports = authenticate