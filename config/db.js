const Sequilize = require('sequelize')
const pg = require('pg')
pg.defaults.ssl = true;

//conexao com banco de dados
const sequelize = new Sequilize('delamrh2e6l8tk','jakgbynxjwlmok','500d426f01c13e7196c9efe2ce89d4c8ba6913cf3e817a714bce31afc9ef4a61',{
    host:"ec2-52-1-95-247.compute-1.amazonaws.com",
    port:5432,
    dialect:'postgres',
    ialectOptions: {
        ssl: {
            rejectUnauthorized: true
        }
    }
})

module.exports={
    Sequelize:Sequilize,
    sequelize:sequelize
}