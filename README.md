# Doshii partner node SDK

TypeScript wrapper for the Doshii Partner API.

## 1.0 Build and install

To build do,

```bash
npm install
npm run build (run as part of prepublish script)
npm pack
```

Installation can be done from the tar ball created by `npm pack`

```
npm i doshii-sdk-2.0.0.tgz
```

## 2.0 Usage

The `Doshii` constructor accepts credentials and is thereafter used for all the API calls.

All the API s are properties of the main `Doshii` class, which can be invoked as required. The API s include `location`, `checkin`, `device`, `loyalty`, `menu`, `order`, `table`, `transaction`, `webhook` and `booking`.

```node
import Doshii, {LogLevel} from 'doshii-sdk'

const options = {
  // required when using the bulk data API
  appId: 'myAppID';
  // Are you using the sandbox environment, defaults to false
  sandbox: true;
  // Defaults to 3
  apiVersion: 3;
  // Defaults to WARN
  logLevel: LogLevel.INFO;
  // Heartbeat interval for websocket, defaults to 30 seconds
  pingInterval: 30;
}
const doshii = new Doshii('myClientId', 'myClientSecret', options);
```

### 2.1 Websocket

Websocket starts up when one subscribes to an event and remains active as long as there is atleast one subscriber. When all the subscribers have unsubscribed, websocket disconnects and waits for the next subscriber to start over again. Once started, heartbeat (ping/pong) messages are exchanged at set time intervals (defaults to 30 seconds and can be set during Doshii class instantiation)

One can subscribe to multiple websocket events with a callback function.

```node
import Doshii, { WebsocketEvents } from "doshii-sdk";

const doshii = new Doshii("myClientId", "myClientSecret");

const callback = (event, data) => {
  if (event === WebsocketEvents.PONG) {
    // do something
    console.log(data);
  }
};

// subscribe to websocket events
const subscriberId = doshii.subscribeToWebsockeEvents(
  [WebsocketEvents.PONG, WebsocketEvents.LOCATION_SUBSCRIBED],
  callback
);

// Later unsubscribe from websocket heartbeat event
doshii.unsubscribeFromWebsocketEvents(subscriberId, [WebsocketEvents.PONG]);

// Unsubscribe from all events
doshii.unsubscribeFromWebsocketEvents(subscriberId);

// Unsubscribe all subscribers
doshii.unsubscribeFromAllWebsocketEvents();
// doshii.clearAllWebsocketSubscriptions() also does the same
```

### 2.2 Calling API s

All API s confirm to the [OPEN API specs](https://sandbox-dashboard.doshii.io/docs/api/app)

```node
doshii.location
  .get("myLocationId")
  .then((res) => console.log(res))
  .catch((error) => console.log(error));

// or await
try {
  await doshii.location.get("myLocationId");
} catch (error) {
  console.log(error);
}
```

All typed payloads and enums can be imported from the root

```node
import Doshii, { TransactionRequest, WebsocketEvents } from "doshii-sdk";

const doshii = new Doshii("myClientId", "myClientSecret");

const data: TransactionRequest = {
  amount: 2500,
  reference: "123",
  invoice: "123",
  linkedTrxId: "123",
  method: "cash",
  tip: 500,
  trn: "100412786589",
  prepaid: true,
  surcounts: [
    {
      posId: "123",
      name: "Item name",
      description: "Item description",
      amount: 1000,
      type: "absolute",
      value: "1000",
    },
  ],
};
try {
  await doshii.createTransaction("myLocationId", "myOrderId", data);
} catch (error) {
  console.log(error);
}
```

#### 2.2.1 Rejection codes

Response to rejection code requests could be of type `RejectionCodeResponse` or `Array<RejectionCodeResponse>` depending on if the request was for all the codes or for just one.

```node
import Doshii, { RejectionCodeResponse } from "doshii-sdk";

const doshii = new Doshii("myClientId", "myClientSecret");

// Get all the rejection codes
const resp = await doshii.getRejectionCodes();

// Get a specific rejection code
const resp = await doshii.getRejectionCode("O1");
```

#### 2.2.2 Bulk data API

Bulk data API can be accessed directly from doshii class. This requires App ID to be passed in either during Doshii class instatiation or while calling bulk data API.

```node
import Doshii, { LocationClasses, DataAggregationRequest } from "doshii-sdk";

const doshii = new Doshii("myClientId", "myClientSecret");

const data: DataAggregationRequest = {
  doshiiId: "rj7DnGBL",
  webhook: {
    url: "https://my.service.com/webhooks/data",
    headers: {},
  },
  mimeType: "application/json",
  fileSize: 10000,
  classifiers: [LocationClasses.BAKERY, LocationClasses.CAFE],
  locations: ["4gJpXq9B"],
  sortBy: {
    property: "created",
    method: "ASC",
  },
  range: {
    start: new Date(Date.UTC(2020, 11, 1)),
    end: new Date(Date.UTC(2021, 1, 1)),
  },
};

// since App ID was not passed in earlier
// it has to be passes during fucntion call
const reqDetails = await doshii.requestBulkDataAggregation(
  "orders",
  data,
  "myAppID"
);

// Else we could pass in during class instantiation
const doshii = new Doshii("myClientId", "myClientSecret", { appId: "myAppID" });
const reqDetails = await doshii.requestBulkDataAggregation("orders", data);
```
