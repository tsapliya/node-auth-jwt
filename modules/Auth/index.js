const jwt = require('./JWT')
const User = require('../../models/login/user')

module.exports = function () {

    const onRefresh = () => {
        return async (req, res) => {
            const refreshToken = req.body.refresh
            const decode = jwt.decodeRefresh(refreshToken, res)

            if (!decode) {
                res.status(401).json()
                return
            }

            const {userId, sessionId} = decode
            const {dataValues: user} = await User.getUserSessionsById(userId)
            let sessions = []

            if (!user?.sessions) {
                res.status(401).json()
                return
            }

            try {
                sessions = JSON.parse(user.sessions)
            } catch {
                res.status(401).json()
                return
            }

            const currentUserSession = sessions.find(i => i.sessionId === sessionId)

            if (!currentUserSession) {
                res.status(401).json()
                return
            }

            if (currentUserSession.token !== refreshToken) {
                user.sessions = JSON.stringify(sessions.filter(i => i.sessionId !== sessionId))
                await User.updateUserSession(user.user_id, user.sessions)
                res.status(401).json()
                return
            }

            const newTokens = jwt.createNewTokens(userId, sessionId)
            user.sessions = JSON.stringify(sessions.map(i => {
                if (i.sessionId === sessionId) {
                    return {
                        ...i,
                        token: newTokens.refresh
                    }
                }
            }))

            await User.updateUserSession(user.user_id, user.sessions)

            res.status(200).json(newTokens)
        }
    }

    return {
        onRefresh
    }
}