const jwt = require("../../modules/Auth/JWT");
const Session = require("../../models/login/Session");

module.exports = class Login {

    users = [
        {
            id: 1,
            name: 'john',
            login: '123',
            sessions: '[{"sessionId":1,"lastTimeUpdate":123,"token":"213","device":"qwe"}]',
            password: '123'
        }
    ]

    user = {}

    constructor() {
    }

    onPostLogin() {
        return (req, res) => {
            const {login, password, info} = req.body
            this.user = this.users.find(i => i.login === login)

            if (!this.user || this.user.password !== password) {
                setTimeout(() => res.status(401).json({error: 'Неверный логин или пароль'}), 2000)
                return
            }

            const {refresh, access} = this.createSession(info)

            res.status(200).json({access, refresh})
        }
    }

    onPostLogout() {
        return (req, res) => {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            if (!token) {
                return res.sendStatus(401)
            }

            const {userId, sessionId} = jwt.verify(token, res)

            this.user = this.users.find(i => i.id === userId)
            this.deleteSession(sessionId)

            res.status(200).json()
        }
    }

    createSession(device) {
        let sessions = []

        try {
            sessions = JSON.parse(this.user.sessions)
        } catch {
            throw new Error()
        }

        const newSessionId = Math.max(...sessions.map(i => i.sessionId)) + 1 || 0
        const newTokens = jwt.createNewTokens(this.user.id, newSessionId)
        const session = new Session({sessionId: newSessionId, device, token: newTokens.refresh})

        sessions.push(session.getObject())
        this.user.sessions = JSON.stringify(sessions)
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