
exports.up = function(knex) {
  return knex.schema.createTable('users', user => {
      user.increments();
      user.string('username').unique().notNullable()
      user.string('password').notNullable()
      user.string('googleId').unique()
  })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users')
};
