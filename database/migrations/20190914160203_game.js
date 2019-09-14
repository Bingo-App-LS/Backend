
exports.up = function(knex) {
    return knex.schema
        .createTable('game', game=> {
            game.increments();
            game.string('name').notNullable().unique();
            game.specificType('phrases', 'varchar[]')
            .defaultTo('[]')
            .alter();
            game.string('password').notNullable();
            game.integer('creatorId').notNullable().references('id').inTable('users').onDelete('cascade');
        })

}


exports.down = function(knex) {
    return knex.schema.dropTableIfExists('game')
};
