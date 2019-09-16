
exports.up = function(knex) {
  return knex.schema.createTable('phrases', tbl => {
      tbl.increments();
      tbl.integer('gameId').notNullable().references('id').inTable('game').onDelete('cascade');
      tbl.string('saying').notNullable();
      tbl.string('whoSaysIt').notNullable();
      tbl.boolean('hasBeenSaid').notNullable();
      tbl.integer('whoSubmittedIt').notNullable().references('id').inTable('users').onDelete('cascade');
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('phrases')
};
