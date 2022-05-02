const jwt = require('jsonwebtoken');
// in order to protect routes

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = {
            email: decodedToken.email,
            userId: decodedToken.userId
        };
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth failed!"
        });
    }
}
module.exports = authenticate