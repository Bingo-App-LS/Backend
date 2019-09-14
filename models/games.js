const db = require('../database/dbConfig.js');


module.exports = {
    addGame,
    findGameById,
    findUsersGames,
    createGame,
    updateGameWithPhrase,
    deleteGame,
    // shuffleGameBoard
}

function findGameById(id) {
    return db('game').where({ id }).returning('*').first()
}

function addGame(game) {
    return db('game').insert(game).returning('*')
}

async function updateGameWithPhrase(newGame) {
    await 
}

async function findUsersGames(id) {
    lets games = await db('usergames').where({ id == user_id })
}