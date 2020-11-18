const knex = require('knex');
const configuration = require('../knexFile');

const connection = knex(configuration.development);

module.exports = connection;