const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = require('../config/secrets.js');
const restricted = require('../api/restricted.js')
const db = require('../models/users.js')
const dbGame = require('../models/games.js')
//findUsersGames, createAGame, hitStartToGetShuffledBoard, need to be able to insert phrase given a game id., 


//begins in /users
//making a new game.....
router.post('/newgame', restricted, (req,res) => {
    const { gameName, password } = req.body;

    if (!gameName || !password || gameName.split('').length < 5 || password.split('').length < 5) {
        res.status(400).json({ message: "Must have a game name longer than 5 characters and password longer than 5 characters."})
    }

    const clean = {
        gameName: gameName,
        password: password,
        phrases: [],
    }

    db
    .addGame(clean)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})

//phrase send in the body.
router.put('/addphrase/:gameid/:userid', restricted, (req, res) => {
    let gameId = req.params.gameid;
    let userId = req.params.userid;
    let phrase = req.body;
    if (!gameId || !userId) {
        return res.status(400).json({ message: "You need both user id of user that clicked create and game id of the game you wish to update."})
    }

    //get the game with that id.  spread in the phrases and add new phrase.
    db
    .findGameById(gameId)
    .then(result => {
        console.log(result)
        let phrases = [...result.phrases, phrase]
        let newGame = {
            id: result.id,
            phrases: phrases,
            name: result.name,
            password: result.password,
            creatorId: result.creatorId
        }
        db
        .updateGameWithPhrase(newGame, id)
        .then(newResult => {
            console.log(newResult)
            res.status(200).json(newResult)
        })
        .catch(err => {
            res.status(500).json({ message: "Internal Server Error"})
        })
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
    
})


module.exports = router;