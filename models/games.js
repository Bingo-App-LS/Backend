const db = require('../database/dbConfig.js');


module.exports = {
    add,
    addGame,
    findGameById,
    findUsersGames,
    updateGameWithPhrase,
    deleteGame,
    findGameByGameName,
    shuffleGameBoard,
    findShuffledBoard
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

async function shuffleGameBoard(id, gameId) {
    const currentGame = await db('game').where({ gameId }).returning('*')
    const nums = [];
    for (let i = 0; i < 17; i++) {
        while (nums.length < 17){
            let number = Math.floor(Math.random() * Math.floor(16))
            if (!nums.includes(number)){
                nums.push(number)
            }
        }
    }
    
    const newPhraseList = await currentGame.phrases.map((phrase, index) => {
        [currentGame.phrases[index], currentGame.phrases[nums[index]]] = [currentGame.phrases[nums[index]], currentGame.phrases[index]]
    })

    let clean = {
        user_id: id,
        game_id: gameId,
        phrase: newPhraseList,
    }
    return db('shuffledboard').insert(clean).returning('*')
}

function findShuffledBoard(id, gameId){
    return db('shuffledboard').where({ user_id: id, game_id: gameId }).returning("*")
}