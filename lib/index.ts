import Doshii from "./doshii";
import sampleData from "./samples";

const clientId =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb3NoaWkiLCJzdWIiOnsiZm9yIjoiQXBwQ2xpZW50SWQiLCJpZCI6bnVsbH0sImV4cCI6MTcxNzg5Mzk5NX0.Y5uNqg28Qg4aIJ3kkrfa7QS_MEaj7aVcu31-yBDdiMY";
const clientSecret =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkb3NoaWkiLCJzdWIiOnsiZm9yIjoiQXBwQ2xpZW50U2VjcmV0IiwiaWQiOm51bGx9LCJleHAiOjE3MTc4OTM5OTV9.yFsQ2TBEXT2j3MKN6t5D62QIhB1az17QfJbr24fFris";

let d = new Doshii(clientId, clientSecret, true);

// d.location
//   .subscribeTo("41Xrwbor")
//   .then((res) => console.log(res))
//   .catch((error) => console.error(error));

// d.location
//   .getAll()
//   .then((res) => console.log(res))
//   .catch((error) => console.log(error));

d.order
  .createOrder("41Xrwbor", sampleData.createOrderSample)
  .then((res) => {
    console.log(res);
  })
  .catch((rej) => {
    console.log(rej);
  });
