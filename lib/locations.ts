
export default class Location {
    getJwt: () => string
    constructor(getJwt: () => string) {
        this.getJwt = getJwt
    }

    test() {
        console.log(this.getJwt())
    }
}