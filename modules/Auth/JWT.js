const jwt = require("jsonwebtoken");
module.exports = {

    checkAccessToken() {
        return (req, res, next) => {
            if (['/api/login', '/api/auth/refresh'].includes(req.originalUrl)) {
                next()
                return
            }
            const authHeader = req.headers['authorization']
            const token = authHeader?.split(' ')[1]
            if (this.decode(token, res)) {
                next()
            }
        }
    },


    decode(token, res = undefined) {
        let decode
        try {
            decode = jwt.verify(token, process.env.JWT_SHORT_KEY)
        } catch (e) {
            if (res) {
                res.status(401).json()
                return
            }
        }
        return decode
    },

    decodeRefresh(token, res = undefined) {
        let decode
        try {
            decode = jwt.verify(token, process.env.JWT_REFRESH_KEY)
        } catch (e) {
            if (res) {
                res.status(401).json()
                return
            }
        }
        return decode
    },

    createNewTokens(userId, sessionId) {
        const refresh = jwt.sign({userId, sessionId}, process.env.JWT_REFRESH_KEY, {expiresIn: '7d'})
        const access = jwt.sign({userId, sessionId}, process.env.JWT_SHORT_KEY, {expiresIn: '5m'})
        return {refresh, access}
    }
}