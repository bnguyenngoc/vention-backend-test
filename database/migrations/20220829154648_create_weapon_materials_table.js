
exports.up = async function(knex) {
 await knex.schema.createTable('weapon_materials', function(t){
    t.integer('weapon_id').index();
    t.integer('material_id').index();
 }) 
};

exports.down = async function(knex) {
  await knex.schema.dropTable('weapon_materials')
};
