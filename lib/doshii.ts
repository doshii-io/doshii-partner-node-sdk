import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
import WebSocket from "ws";

import Location from "./location";
import Order from "./order";

import { LogLevel, Logger } from './utils';

enum WebSocketEvents {
  ORDER_UPDATED = 'order_updated',
  ORDER_CREATED = 'order_created',
  TRANSACTION_UPDATED = 'transaction_updated',
  BOOKING_CREATED = 'booking_created',
  BOOKING_UPDATED = 'booking_updated',
  CHECKIN_CREATED = 'checkin_created',
  CHECKIN_UPDATED = 'ckeckin_updated',
  CHECKIN_DELETED = 'checkin_deleted',
  MENU_UPDATED = 'menu_updated',
  POINTS_REDEEMED = 'points_redemption',
  REWARD_REDEEMED = 'reward_redemption',
  TABLE_CREATED = 'table_created',
  TABLE_REMOVED = 'table_removed',
  TABLE_UPDATED = 'table_updated',
  TABLE_BULK_UPDATED = 'table_bulk_updated',
  CARD_ACTIVATION_REQUESTED = 'card_activate',
  CARD_ENQUIRY_REQUESTED = 'card_enquiry',
  ORDER_PREPROCESSED = 'order_preprocess',
  LOCATION_SUBSCRIBED = 'location_subscription',
  LOCATION_HOURS_UPDATED = 'location_hours_updated',
  APP_MENU_UPDATED = 'app_menu_updated',
  APP_MENU_ITEM_UPDATED = 'app_menu_item_updated',
  LOYALTY_CHECKIN_CREATED = 'loyalty_checkin_created',
  LOYALTY_CHECKIN_UPDATED = 'loyalty_checkin_updated',
  LOYALTY_CHECKIN_DELETED = 'loyalty_checkin_deleted',
  PING = 'ping'
}

export default class Doshii {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly url: string;
  private readonly logger: Logger;

  // websocket and subscribers
  private websocket!: WebSocket;
  private subscribers: Map<string, Array<(data: any) => void>> = new Map();
  private eventSubscribers: Map<WebSocketEvents, Array<string>> = new Map();

  readonly location: Location;
  readonly order: Order;

  constructor(clientId: string, clientSecret: string, sandbox = false, logLevel = LogLevel.WARN) {
    this.logger = new Logger(logLevel);
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.url = sandbox
      ? "https://sandbox.doshii.co/partner/v3"
      : "https://live.doshii.co/partner/v3";

    this.location = new Location(this.submitRequest.bind(this));
    this.order = new Order(this.submitRequest.bind(this));

    // debugging
    // setTimeout(() => {
    //   this.logger.log("timers up!");
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
      this.logger.debug("Doshii: Opened websocket");
      const heartbeat = () => {
        this.logger.debug("Doshii: Sending heartbeat to websocket");
        this.websocket.send(
          JSON.stringify({
            doshii: {
              ping: Date.now(),
              version: "1.2.3",
            },
          })
        );
        this.logger.debug("Doshii: Heartbeat sent to websocket");
      };
      // Send one immediately to complete the handshake
      heartbeat();
      // Then 30 every seconds or so thereafter to keep alive
      setInterval(heartbeat, 30000);
    };

    this.websocket.onmessage = (event: any) => {
      this.onWebsocketMessage(event);
    };

    this.websocket.onerror = (event: any) => {
      this.onWebsocketError(event);
    };

    this.websocket.onclose = (event: any) => {
      this.onWebsocketClose(event);
    };

  }

  private subscribeToWebsockeEvent(event: WebSocketEvents, callbacks: Array<(data: any) => void>) {
    if (callbacks.length < 1) {
      throw new Error('Doshii: No callbacks specified.')
    }

    const subscriberId = Date.now().toString(36)
    this.subscribers.set(subscriberId, callbacks)

    if (this.eventSubscribers.has(event)) {
      let subscribers = this.eventSubscribers.get(event)
      subscribers!.concat(subscriberId)
      this.eventSubscribers.set(event, subscribers!)
    } else {
      this.eventSubscribers.set(event, [subscriberId])
    }
    this.subscribers.set(subscriberId, callbacks)
  }

  private unsubscribeFromWebsocketEvent(subscriberId: string, event: WebSocketEvents) {

    if (!this.eventSubscribers.has(event)) {
      throw new Error(`Doshii: No subscribers for event - ${event}`)
    }

    // remove from eventSubscriber Map
    const subscribers = this.eventSubscribers.get(event)
    let newSubscribers: Array<string> = []
    for (let i = 0; i < subscribers!.length; i++) {
      const subscriber = subscribers![i]
      if (subscriber !== subscriberId) {
        newSubscribers.push(subscriber)
      }
    }
    this.subscribers.delete(subscriberId)
  }

  clearWebsocketSubscriptions() {
    this.subscribers.clear()
    this.eventSubscribers.clear()
  }

  private onWebsocketMessage(event: any) {
    this.logger.debug("Doshii: Recieved message from websocket");
    const eventData = JSON.parse(event.data);
    if ("doshii" in eventData && "pong" in eventData.doshii) {
      this.logger.debug("Doshii: Got pong");
      this.notifySubscribers(WebSocketEvents.PING, eventData)
      return;
    }
    const eventType = eventData.emit[0]
    const eventPayload = eventData.emit[1]
    this.notifySubscribers(eventType, eventPayload)

  }

  private notifySubscribers(event: WebSocketEvents, data: any) {
    // get subscribers for the event
    if (!this.eventSubscribers.has(event)) return
    const subscribers = this.eventSubscribers.get(event)
    if (!subscribers || subscribers.length < 1) return
    // get callback func for each subscriber and exec
    for (let i = 0; i < subscribers.length; i++) {
      const subscriber = subscribers[i]
      if (!this.subscribers.has(subscriber)) continue
      const callbacks = this.subscribers.get(subscriber)
      if (!callbacks || callbacks.length < 1) continue
      for (let j = 0; j < callbacks.length; j++) {
        try {
          callbacks[j](data)
        } catch (error) {
          this.logger.error(`Doshii: Error while executing callback for subscriber ${subscriber}`)
          this.logger.error(error)
        }
      }
    }
  }

  private onWebsocketError(event: any) {
    this.logger.warn(
      `Doshii: Recieved error from websocket - ${JSON.stringify(event.data)}`
    );
  }

  private onWebsocketClose(event: any) {
    this.logger.warn(`Doshii: Closed websocket - ${JSON.stringify(event.data)}`);
  }
}
