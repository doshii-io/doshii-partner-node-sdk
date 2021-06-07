import jwt from 'jsonwebtoken';

class Doshii {
    private readonly clientId: string
    private readonly clientSecret: string

    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
    }

    getAuthToken() {
        const payload = {
            clientId: this.clientId,
            timestamp: Date.now()
        }
        return jwt.sign(payload, this.clientSecret)
    }
}