const {Sequelize, DataTypes} = require('sequelize')
const db = require('../../utils/database')

const model = db.sequelize.define('User', {
    user_id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sessions: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

const getUserSessionsById = user_id => {
    return model.findOne({
        attributes: ['user_id', 'sessions'],
        where: {user_id}
    })
}

const getUserByLogin = (login, password) => {
    return model.findOne({
        attributes: ['user_id', 'sessions'],
        where: {login, password}
    })
}

const updateUserSession = (user_id, newSessions) => {
    return model.update({sessions: newSessions}, {where: {user_id}})
}

module.exports = {
    model,
    getUserSessionsById,
    getUserByLogin,
    updateUserSession
}