import Doshii from "./doshii";
import sampleData from "./samples";


let d = new Doshii(clientId, clientSecret, true);

// d.location
//   .subscribeTo("41Xrwbor")
//   .then((res) => console.log(res))
//   .catch((error) => console.error(error));

d.location
  .getTerminal("41Xrwbor")
  .then((res) => console.log(res))
  .catch((error) => console.log(error));

// d.order
//   .createOrder("41Xrwbor", sampleData.createOrderSample)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((rej) => {
//     console.log(rej);
//   });
