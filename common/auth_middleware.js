const jwt = require('jsonwebtoken');
// in order to protect routes

const authenticate = async (req, res, next) => {
    const token1 = req.headers.authorization.split(" ")[1];
    console.log(token1);
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
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