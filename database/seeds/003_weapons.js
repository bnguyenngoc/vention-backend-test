
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('weapons').del()
    .then(function () {
      // Inserts seed entries
      return knex('weapons').insert([
        {
          name: 'Excalibur',
          power_level: 4525320,
          qty: 47,
          status: "new"
        },
        {
          name: 'Magic Staff',
          power_level: 1987080,
          qty: 139,
          status: "new"
        },
      ]);
    });
};
