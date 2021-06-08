export default class Location {
  getJwt: () => string;
  value = 0;

  constructor(getJwt: () => string) {
    this.getJwt = getJwt;
  }
  test() {
    console.log(`from location: ${this.getJwt()}`);
  }
}
