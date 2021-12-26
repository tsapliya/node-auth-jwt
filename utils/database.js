const Sequelize = require('sequelize')
const {DB_NAME, DB_USER_NAME, DB_PASSWORD, DB_HOST} = require('../config/config.json')

const sequelize = new Sequelize(DB_NAME, DB_USER_NAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
})

const sync = async () => {
    try {
        await sequelize.sync()
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    sync,
    sequelize
}