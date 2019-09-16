
exports.up = function(knex) {
    return knex.schema
        .createTable('game', game=> {
            game.increments();
            game.string('name').notNullable().unique();
            game.string('password').notNullable();
            game.integer('creatorId').notNullable().references('id').inTable('users').onDelete('cascade');
            game.boolean('inProgress').notNullable();
        })

}


exports.down = function(knex) {
    return knex.schema.dropTableIfExists('game')
};
