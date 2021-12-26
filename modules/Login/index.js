const jwt = require("../../modules/Auth/JWT")
const Session = require("../../models/login/Session")
const User = require('../../models/login/user')

module.exports = class Login {

    user = {
        id: undefined,
        sessions: undefined
    }

    constructor() {
    }

    onPostLogin() {
        return async (req, res) => {
            const {login, password, info} = req.body
            const response = await User.getUserByLogin(login, password)

            if (!response?.dataValues) {
                setTimeout(() => res.status(401).json({error: 'Неверный логин или пароль'}), 2000)
                return
            }

            const {user_id: id, sessions} = response.dataValues
            this.user.id = id
            this.user.sessions = sessions

            const {refresh, access} = await this.createSession(info)

            res.status(200).json({access, refresh})
        }
    }

    onPostLogout() {
        return async (req, res) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            if (!token) {
                res.sendStatus(401)
                return
            }

            const decode = jwt.decode(token, res)

            if (!decode) {
                res.sendStatus(401)
                return
            }

            const {userId, sessionId} = decode

            console.log(userId, sessionId)

            const response = await User.getUserSessionsById(userId)

            const {user_id: id, sessions} = response.dataValues
            this.user.id = id
            this.user.sessions = sessions

            this.deleteSession(this.user.id)
            await User.updateUserSession(this.user.id, this.user.sessions)

            res.status(200).json()
        }
    }

    async createSession(device) {
        let sessions = []
        let newSessionId = 0

        if (this.user.sessions.length) {
            try {
                sessions = JSON.parse(this.user.sessions)
            } catch {
                throw new Error()
            }
        }

        if (sessions.length) {
            newSessionId = Math.max(...sessions.map(i => i.sessionId)) + 1
        }

        const newTokens = jwt.createNewTokens(this.user.id, newSessionId)
        const session = new Session({sessionId: newSessionId, device, token: newTokens.refresh})

        sessions.push(session.getObject())
        this.user.sessions = JSON.stringify(sessions)
        await User.updateUserSession(this.user.id, this.user.sessions)
        return newTokens
    }

    deleteSession(sessionId) {
        let sessions = []
        try {
            sessions = JSON.parse(this.user.sessions)
        } catch {
            throw new Error()
        }
        this.user.sessions = JSON.stringify(sessions.filter(i => i.sessionId !== sessionId))

    }
}