const db = require('../config/db');

const Usuario = db.sequelize.define('usuario',{
    idUser:{
        type: db.Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nameUser:{
        type: db.Sequelize.STRING,
        allowNull:false,
    },

    emailUser: {
        type: db.Sequelize.STRING,
        allowNull: false,
        unique: true
    },

    amountUser:{
        type: db.Sequelize.FLOAT,
        allowNull:false,
    },

    createdAt: {
        field: 'created_at',
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW
    },

    updatedAt: {
        field: 'updated_at',
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW
    },
})

Usuario.sync({ force: true })
module.exports = Usuario;