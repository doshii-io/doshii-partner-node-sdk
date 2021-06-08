export default class Orders {
  private readonly getJwt: () => string;
  private orders = new Map<string, (value: any) => void>();

  constructor(getJwt: () => string) {
    this.getJwt = getJwt;
  }

  createOrder(id: string) {
    console.log(`from orders ${this.getJwt()}`);
    console.log("creating order");
    let resolveFunc: any;
    const p = new Promise((res, rej) => {
      resolveFunc = res;
    });
    this.orders.set(id, resolveFunc);
    console.log(this.orders);
    console.log("returning promise");
    return p;
  }

  orderUpdate(data: any) {
    console.log("Orders:got orderUpdate");
    const res = this.orders.has(data.id) ? this.orders.get(data.id) : undefined;
    console.log(res);
    if (res) {
      console.log("exec res");
      res(data);
    } else {
      console.log("no res");
    }
  }
}
