// Update with your config settings.
const pg = require('pg')
pg.defaults.ssl = true;
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://jakgbynxjwlmok:500d426f01c13e7196c9efe2ce89d4c8ba6913cf3e817a714bce31afc9ef4a61@ec2-52-1-95-247.compute-1.amazonaws.com:5432/delamrh2e6l8tk',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },

    migrations: {
        directory: './models/migrations'
    },
    useNullAsDefault: true,
},

};