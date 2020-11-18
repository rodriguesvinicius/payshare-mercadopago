
exports.up = function(knex) {
    return knex.schema.createTable('Merchant',(table)=>{
        table.increments('idUser').primary();
        table.string('nameUser').notNullable();
        table.string('emailUser').notNullable();
        table.float('amount').notNullable();
    })
};

exports.down = function(knex) {
  
};
