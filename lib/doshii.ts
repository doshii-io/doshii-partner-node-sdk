import jwt from "jsonwebtoken";
import WebSocket from "ws";
import Locations from "./locations";
import Orders from "./orders";

export default class Doshii {
  private readonly clientId: string;
  private readonly clientSecret: string;

  private websocket!: WebSocket;

  readonly locations: Locations;
  readonly orders: Orders;

  constructor(clientId: string, clientSecret: string, sandbox = false) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.locations = new Locations(this.getJwt.bind(this));
    this.orders = new Orders(this.getJwt.bind(this));

    setTimeout(() => {
      console.log("timers up!");
      this.orders.orderUpdate({ id: "1", status: "success" });
    }, 5000);

    this.websocketSetup(sandbox);
  }

  protected getJwt() {
    const payload = {
      clientId: this.clientId,
      timestamp: Date.now(),
    };
    return jwt.sign(payload, this.clientSecret);
  }

  private websocketSetup(sandbox: boolean) {
    const wsUrl = sandbox
      ? "wss://sandbox-socket.doshii.co/app/socket?auth="
      : "wss://live-socket.doshii.co/app/socket?auth=";
    const auth = Buffer.from(this.clientId).toString("base64");
    this.websocket = new WebSocket(wsUrl + auth);

    // send pings every 30s and on open
    this.websocket.onopen = () => {
      console.debug("Doshii: Opened websocket");
      const heartbeat = () => {
        console.debug("Doshii: Sending heartbeat to websocket");
        this.websocket.send(
          JSON.stringify({
            doshii: {
              ping: Date.now(),
              version: "1.2.3",
            },
          })
        );
        console.debug("Doshii: Heartbeat sent to websocket");
      };
      // Send one immediately to complete the handshake
      heartbeat();
      // Then 30 every seconds or so thereafter to keep alive
      setInterval(heartbeat, 30000);
    };

    this.websocket.onmessage = (event) => {
      this.onWebsocketMessage(event);
    };

    this.websocket.onerror = (event) => {
      this.onWebsocketError(event);
    };

    this.websocket.onclose = (event) => {
      this.onWebsocketClose(event);
    };
  }

  private onWebsocketMessage(event: any) {
    console.debug("Doshii: Recieved message from websocket");
    switch (event.type) {
      case "order_status":
        this.orders.orderUpdate(event);
        break;
      default:
        console.info(
          `Doshii: Websocket invalid event - ${JSON.stringify(event)}`
        );
    }
  }

  private onWebsocketError(event: any) {
    console.error(
      `Doshii: Recieved error from websocket - ${JSON.stringify(event.data)}`
    );
  }

  private onWebsocketClose(event: any) {
    console.info(`Doshii: Closed websocket - ${JSON.stringify(event.data)}`);
  }
}
