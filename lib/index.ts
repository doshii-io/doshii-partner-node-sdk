import Doshii from "./doshii";

let d = new Doshii("clientId", "clientSecret");

d.locations.test();

d.orders
  .createOrder("1")
  .then((res) => {
    console.log(`orders from index ${JSON.stringify(res)}`);
  })
  .catch((rej) => {
    console.log(rej);
  });
