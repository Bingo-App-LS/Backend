const db = require('../database/dbConfig.js');



module.exports = {
    findUser,
    add,
    remove,
    findAllUsersOfGame
}

function add(user){
    return db('users')
        .insert(user)
        .returning('*')
}

function remove(id) {
    return db('users').where({ id }).del()
}

function findUser(id) {
    return db('users').where({ id }).returning("*").first();
}

async function findAllUsersOfGame(game_id) {
    const users = await db('usergames').where({ game_id }).returning("*")
    return users
}