const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const restricted = require('../api/restricted.js');
const db = require('../models/users.js')



router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hash(user.password);
    user.password = hash;

    if (!user.username || !user.password) {
        return res.status(401).json({ message: "You are missing username or password."})
    }

    if (user.username.split('').length === 0 || user.password.split('').length < 5) {
        return res.status(400).json({ message: "password must be longer than 5 characters and username longer than 0 characters."})
    }

    let clean = {
        username: user.username,
        password: user.password
    }

    db
    .add(clean)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error"})
    })
})


router.post('/', (req, res) => {
    let { username, password } = req.body;

    if (!username || !password){
        res.status(400).json({ message: "Bad Request."})
    }

    db
    .findUser(username)
    .then(user => {
        if (user && bcrypt.compareSync(password, user.password))
        {
            const tokne = generateToken(user)
            res.status(200).json({id: user.id, username: user.username, token: token})
        }
        else {
            res.status(401).json({message: "Password or username is incorrect"})
        }
    })
    .catch(err => {
        console.error(err)
        res.status(500).json({ message: "Internal Server Error"})
    })
})


router.delete('/register/:id', (req, res) => {
    const id = req.params.id;

    db
    .remove(id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "internal server error"})
    })
})

const generateToken = (user) => {
    const payload = {
        subject: user.id,
        username: user.username
    }
    const options = {
        expiresIn: "12h"
    }

    return jwt.sign(payload, secret.jwtSecret, options)
}

module.exports = router;