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
    const { name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    password = hash;
    let id = req.params.id;  //user id, creating a game.
    if (!name || !password || password.split('').length < 5) {
        res.status(400).json({ message: "Must have a game name longer than 5 characters and password longer than 5 characters."})
    }

    const clean = {
        gameName: name,
        password: password,
        phrases: [],
        creatorId: id,
        inProgress: false
    }

    db
    .addGame(clean)
    .then(result => { //creates game in 'game' table but need to also make a usergames table with foreign keys to join.
        // console.log(result)
        let game_id = result.id;
            db
            .add(game_id, user_id) 
            .then(usergame => {
                // console.log(usergame)
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

//adds a phrase
router.post('/addphrase/:gameId/:userId', (req, res) => {
    let id = req.params.id //users id
    let gameId = req.params.gameId;

    if (!req.body.saying || !req.body.whoSaysIt){
        return res.status(400).json({ message: "There needs to be a saying and who says it "})
    }

    let clean = {
        game_id: gameId,
        saying: req.body.saying,
        whoSaysIt: req.body.whoSaysIt,
        whoSubmittedIt: id,
        hasBeenSaid: false
    }
    db
    .addPhrase(clean)
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.status(500).json({ message: "Internal Server Error"})
    })
})

//making a shuffled board for the user of the game//
router.post('/shuffledboard/:id/:gameid', (req, res) => {
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

//phrase needs to be and obj = {
   // saying: ""
   // hasBeenSaid: T or F
   // whoSubmitted saying: id of user//
   //whoSaysIt: person who says the saying.
//}