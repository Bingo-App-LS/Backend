const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js')


module.exports = (req, res, next) => {

    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodeToken) => {
            if (err) {
                res.status(401).json({ message: "You are missing the token in the headers with appropriate key"})
            } else {
                next()
            }
        })
    } else {
        res.status(400).json({ message: "Something is wrong with the token."})
    }
}