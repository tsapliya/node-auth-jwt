module.exports = class Session {

    sessionId = undefined
    lastTimeUpdate = undefined
    token = undefined
    device = undefined

    /**
     *
     * @param {Number} sessionId
     * @param {String} token
     * @param {String} device
     */
    constructor({sessionId, token, device}) {
        this.token = token
        this.device = device
        this.sessionId = sessionId
        this.lastTimeUpdate = new Date().getTime()
    }

    getObject() {
        return {
            sessionId: this.sessionId,
            lastTimeUpdate: this.lastTimeUpdate,
            token: this.token,
            device: this.device
        }
    }
}