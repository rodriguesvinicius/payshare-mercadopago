
exports.up = function(knex) {
    return knex.schema.createTable('transaction',(table)=>{
        table.increments('transactionId').primary();
        table.float('amount').notNullable();
        table.string('status').notNullable();
        table.string('description').notNullable();
        table.string('payment_method').notNullable();
        table.string('currency_id');
        table.integer('external_reference').notNullable();
        table.string('init_point')
        table.integer('user_id').references('user_id').inTable('user_pf');
        table.integer('lobby_id').references('lobby_id').inTable('lobby')
    })
};

exports.down = function(knex) {
  
};
