
exports.up = function(knex) {
    return knex.schema
        .createTable('usersgames', usergame => {
            usergame.increments();
            usergame.integer('user_id').notNullable().references('id').inTable('users').onDelete('cascade')
            usergame.integer('game_id').notNullable().references('id').inTable('game').onDelete('cascade')
        })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('usersgames')
};
