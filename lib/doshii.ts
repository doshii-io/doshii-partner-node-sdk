import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
import WebSocket from "ws";

import Location from "./location";
import Order from "./order";

export default class Doshii {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly url: string;

  private websocket!: WebSocket;

  readonly location: Location;
  readonly order: Order;

  constructor(clientId: string, clientSecret: string, sandbox = false) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.url = sandbox
      ? "https://sandbox.doshii.co/partner/v3"
      : "https://live.doshii.co/partner/v3";

    this.location = new Location(this.submitRequest.bind(this));
    this.order = new Order(this.submitRequest.bind(this));

    // debugging
    // setTimeout(() => {
    //   console.log("timers up!");
    //   this.order.orderUpdate({ id: "1", status: "cancelled" });
    // }, 5000);

    this.websocketSetup(sandbox);
  }

  protected async submitRequest(data: AxiosRequestConfig) {
    const payload = {
      clientId: this.clientId,
      timestamp: Date.now() / 1000,
    };
    try {
      const resp = await axios({
        ...data,
        baseURL: this.url,
        headers: {
          ...data.headers,
          "content-type": "application/json",
          authorization: `Bearer ${jwt.sign(payload, this.clientSecret)}`,
        },
      });
      return resp.data;
    } catch (error) {
      throw error;
    }
  }

  private websocketSetup(sandbox: boolean) {
    const wsUrl = sandbox
      ? "wss://sandbox-socket.doshii.co/app/socket?auth="
      : "wss://live-socket.doshii.co/app/socket?auth=";
    const auth = Buffer.from(this.clientId).toString("base64");
    // debugging
    // const wsUrl = "wss://echo.websocket.org";
    // const auth = "";
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
    const eventData = JSON.parse(event.data);
    switch (eventData.type) {
      case "order_status":
        this.order.orderUpdate(eventData.data);
        break;
      default:
        if ("doshii" in eventData && "pong" in eventData.doshii) {
          console.debug("Doshii: Got pong");
        } else {
          console.info("Doshii: Websocket unknown event");
          console.info(eventData);
        }
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
