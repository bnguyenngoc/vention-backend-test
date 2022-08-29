
exports.up = async function(knex) {
  await knex.schema.createTable('weapons', function(t){
    t.increments('id').unsigned().primary();
    t.string('name').notNullable();
    t.integer('power_level');
    t.integer('qty');
    t.enu('status', ['new', 'broken']).defaultTo('new', options={});
  })
};

exports.down = async function(knex) {
  await knex.schma.dropTable('weapons')
};
