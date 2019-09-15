const db = require('../database/dbConfig.js');


module.exports = {
    add,
    addGame,
    findGameById,
    findUsersGames,
    updateGameWithPhrase,
    deleteGame,
    findGameByGameName
    // shuffleGameBoard
}

function findGameById(id) {
    return db('game').where({ id }).returning('*').first()
}

function findGameByGameName(gameName) {
    return db('game').where({ gameName }).returning('*').first()
}

function addGame(game) {
    return db('game').insert(game).returning('*')
}

function updateGameWithPhrase(newGame, id) {
    return db('game').where({ id }).update(newGame).returning('*')
}

async function findUsersGames(id) {
    const userGames = await db('usergames').where({ user_id: id}).returning('*');
    listOfGames = userGames.map(game => {
         db('game').where({ id: game.game_id}).returning('*')
    })
    return listOfGames
}


function deleteGame(id) {
    return db('game').where({ id }).del().first();
}

//adds to the usergames//
function add(game_id, user_id) {
    return db('usergames').insert(game_id, user_id).returning('*')
}