
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.increments();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('id');
  });
};
