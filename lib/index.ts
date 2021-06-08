import Doshii from "./doshii";
import sampleData from "./samples";

let d = new Doshii("clientId", "clientSecret", true);

d.location
  .getAll()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));

// d.order
//   .createOrder("1234", sampleData.createOrderSample)
//   .then((res) => {
//     console.log(`orders from index ${JSON.stringify(res)}`);
//   })
//   .catch((rej) => {
//     console.log(rej);
//   });
