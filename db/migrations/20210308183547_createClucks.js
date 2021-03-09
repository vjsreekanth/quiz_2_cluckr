
exports.up = function(knex) {
    return knex.schema.createTable('clucks', table => {
        table.bigIncrements('id')
        table.text('image_url')
        table.string('username')
        table.text('content')
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('clucks')
  
};
