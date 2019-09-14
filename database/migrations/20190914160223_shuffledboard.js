
exports.up = function(knex) {
    return knex.schema.createTable('shuffledboard', board => {
        board.increments();
        board.integer('user_id').notNullabe().references('id').inTable('users').onDelete('cascade')
        board.integer('game_id').notNullable().references('id').inTable('game').onDelete('cascade')
        board.specificType('phrases', 'varchar[]');
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('shuffledboard')
};
