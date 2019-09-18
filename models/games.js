const db = require('../database/dbConfig.js');


module.exports = {
    add,
    addGame,
    findGameById,
    findUsersGames,
    addPhrase,
    deleteGame,
    findGameByGameName,
    shuffledGameBoard,
    findShuffledBoard
}

function findGameById(id) {
    return db('game').where({ id }).returning('*').first()
}

function findGameByGameName(name) {
    return db('game').where({ name }).first()
}

function addGame(game) {
    return db('game').insert(game).returning('*')
}

function addPhrase(phrase) {
    return db('phrases').insert(phrase).returning('*')
}

async function findUsersGames(id) {
    return db('usersgames').where({ user_id: id}).returning('*');
    
}


function deleteGame(id) {
    return db('game').where({ id }).del().first();
}

//adds to the usersgames//
function add(gameIDs) {
    return db('usersgames').insert(gameIDs).returning('*')
}

async function shuffledGameBoard(id, gameId) {
    const currentGame = await db('phrases').where({ gameId: gameId })
    
    currentGame.map((phrase, index) => {
        let number = Math.floor(Math.random() * Math.floor(16))
        [currentGame.phrase[index], currentGame.phrase[number]] = [currentGame.phrase[number], currentGame.phrase[index]]
    })

    let clean = {
        user_id: id,
        game_id: gameId,
        phrase: currentGame,
    }

    return db('shuffledboard').insert(clean).returning('*')
}

function findShuffledBoard(id, gameId){
    return db('shuffledboard').where({ user_id: id, game_id: gameId }).returning("*")
}