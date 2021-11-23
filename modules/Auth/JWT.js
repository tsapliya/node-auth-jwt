const jwt = require("jsonwebtoken");
module.exports = {

    checkAccessToken() {
        return (req, res, next) => {
            if (['/api/login', 'api/auth/refresh'].includes(req.baseUrl)) {
                next()
            }
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            this.verify(token, res)
            next()
        }
    },

    verify(token, res = undefined) {
        let decode
        try {
            decode = jwt.verify(token, process.env.JWT_SHORT_KEY)
        } catch (e) {
            console.error(e)
            if (res) {
                res.status(401).json()
            }
        }
        return decode
    },

    createNewTokens(userId, sessionId) {
        const refresh = jwt.sign({userId, sessionId}, process.env.JWT_REFRESH_KEY, {expiresIn: '500s'})
        const access = jwt.sign({userId, sessionId}, process.env.JWT_SHORT_KEY, {expiresIn: '5m'})
        return {refresh, access}
    }
}