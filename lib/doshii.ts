import jwt from 'jsonwebtoken';
import Locations from './locations';

export default class Doshii {
    private readonly clientId: string
    private readonly clientSecret: string
    private readonly locations: Locations

    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId
        this.clientSecret = clientSecret
        this.locations = new Locations(this.getJwt.bind(this))
    }

    getJwt() {
        const payload = {
            clientId: this.clientId,
            timestamp: Date.now()
        }
        return jwt.sign(payload, this.clientSecret)
    }

    test() {
        this.locations.test()
    }
}