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
router.post('/newgame/:id', restricted, (req,res) => {
    const { gameName, password } = req.body;
    const hash = bcrypt.hashSync(password);
    password = hash;
    let id = req.params.id;  //user id, creating a game.
    if (!gameName || !password || password.split('').length < 5) {
        res.status(400).json({ message: "Must have a game name longer than 5 characters and password longer than 5 characters."})
    }

    const clean = {
        gameName: gameName,
        password: password,
        phrases: [],
        creatorId: id
    }

    db
    .addGame(clean)
    .then(result => { //creates game in 'game' table but need to also make a usergames table with foreign keys to join.
        console.log(result)
        let game_id = result.id;
            db
            .add(game_id, user_id) 
            .then(usergame => {
                console.log(usergame)
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ message: "Internal Server Error"})
            })
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})

//this post allows a user that doesn't create the game to login in using the given gamename and password to the user.  Will then add them tot the 'usergames' table and will allow to use foreign keys....
router.post('/newgameuser/:id', (req, res) => {
    let userid = req.params.id;
    let game = req.body;
    if (!game.name || !game.password) {
        res.status(400).json({ message: "Must have a game name and password in the request body."})
    }
    db
    .findGameByGameName(game.name)
    .then(result => {
        if (result && bcrypt.compareSync(game.password, result.password)) {
            db
            .add(result.id, userid)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json({ message: "Internal Server Error"})
            })
        }
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})

//phrase send in the body.//This router allows us to add phrases to the game.  we will return the result that is in their and spread in the phrases into the new array and then add the new phrase at the end.....
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
        .updateGameWithPhrase(newGame, gameId)
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

//deletes a phrase by index number.
router.delete('/deletephrase/:gameid/:phraseIndex', restricted, (req, res) => {
    let phraseIndex = req.params.phraseIndex;
    let gameId = req.params.gameid;

    db
    .findGameById(gameId)
    .then(async (result) => {
        const newPhrases = await result.phrases.filter((item, index) => {
            index !== phraseIndex
        })
        let clean = {
            id: result.id,
            name: result.name,
            password: result.password,
            creatorId: result.creatorId,
            phrases: newPhrases
        }
        db
        .updateGameWithPhrase(clean)
        .then(newResult => {
            res.status(200).json({ message: "Internal Server Error"})
        })
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})


router.delete('/:id', restricted, (req, res) => {
    let id = req.params.id;

    db
    .deleteGame(id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})

//purpose is to call 'usergames' table using the user id and find all the ids of the games they are participating in and return the games list.......
router.get('/findusergames/:id', (req, res) => {
    let id = req.params.id; //id of the user.....

    db
    .findUsersGames(id)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })


})


//making a shuffled board for the user of the game//
router.post('/shuffleboard/:id/:gameid', (req, res) => {
    let id = req.params.id;
    let gameId = req.params.gameid;
    db
    .shuffleGameBoard(id, gameId)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})

//finds a board that has already been shuffled....
router.get('shuffledboard/:id/:gameid', (req, res) => {
    let id = req.params.id;
    let gameId = req.params.gameid;

    db
    .findShuffledBoard(id, gameId)
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})
module.exports = router;