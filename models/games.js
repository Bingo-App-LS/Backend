const db = require('../database/dbConfig.js');


module.exports = {
    add,
    addGame,
    findGameById,
    // findUsersGames,
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

async function updateGameWithPhrase(newGame, id) {
    return db('game').where({ id }).update(newGame).returning('*')
}

// async function findUsersGames(id) {
//     lets games = await db('usergames').where({}).returning('*')
// }


function deleteGame(id) {
    return db('game').where({ id }).del().first();
}

function add(game_id, user_id) {
    return db('usergames').insert(game_id, user_id).returning('*')
}