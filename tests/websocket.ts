import Doshii, { WebsocketEvents } from "../lib";
import WebSocket from "ws";
import http from 'http';

describe("Websocket", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let server: any;
  let ws: WebSocket;
  let serverPort = '61286';
  let pongSubscriber: string;

  beforeAll((done) => {
    server = http.createServer(() => console.log(" -/- "));

    // console.log('creating mock server at', `http://localhost:${serverPort}?auth=${auth}`);

    const wss = new WebSocket.Server({ server });

    wss.on('connection', socket => {
      ws = socket;
      socket.on('message', data => {
        const json = JSON.parse(`${data}`);
        if (json?.doshii?.ping) {
          socket.send(JSON.stringify({doshii: { pong: Date.now() }}));
        }
      });
    });  

    server.listen(serverPort, () => {
    });

    doshii = new Doshii(clientId, clientSecret, {
      sandbox: true,
      pingInterval: 500,
      websocketUrlOverride: `http://localhost:${serverPort}?auth=`
    });

    // subscribe to pong to open socket
    pongSubscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.PONG],
      () => {
        done();
      }
    );
  });

  afterAll((done) => {
    doshii.unsubscribeFromWebsocketEvents(pongSubscriber, [WebsocketEvents.PONG]);

    server.on('close', () => done());
    server.close(() => server.unref());
  });

  test("Should receive PONG", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.PONG],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.PONG]);
        done();
      }
    );
  });

  test("Should receive ORDER_CREATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.ORDER_CREATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.ORDER_CREATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.ORDER_CREATED, {}]}));
  });

  test("Should receive ORDER_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.ORDER_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.ORDER_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.ORDER_UPDATED, {}]}));
  });

  test("Should receive TRANSACTION_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.TRANSACTION_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.TRANSACTION_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.TRANSACTION_UPDATED, {}]}));
  });

  test("Should receive BOOKING_CREATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.BOOKING_CREATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.BOOKING_CREATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.BOOKING_CREATED, {}]}));
  });

  test("Should receive BOOKING_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.BOOKING_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.BOOKING_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.BOOKING_UPDATED, {}]}));
  });

  test("Should receive CHECKIN_CREATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.CHECKIN_CREATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.CHECKIN_CREATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.CHECKIN_CREATED, {}]}));
  });

  test("Should receive CHECKIN_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.CHECKIN_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.CHECKIN_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.CHECKIN_UPDATED, {}]}));
  });

  test("Should receive CHECKIN_DELETED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.CHECKIN_DELETED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.CHECKIN_DELETED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.CHECKIN_DELETED, {}]}));
  });

  test("Should receive MENU_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.MENU_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.MENU_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.MENU_UPDATED, {}]}));
  });

  test("Should receive POINTS_REDEEMED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.POINTS_REDEEMED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.POINTS_REDEEMED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.POINTS_REDEEMED, {}]}));
  });

  test("Should receive REWARD_REDEEMED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.REWARD_REDEEMED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.REWARD_REDEEMED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.REWARD_REDEEMED, {}]}));
  });

  test("Should receive TABLE_CREATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.TABLE_CREATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.TABLE_CREATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.TABLE_CREATED, {}]}));
  });

  test("Should receive TABLE_REMOVED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.TABLE_REMOVED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.TABLE_REMOVED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.TABLE_REMOVED, {}]}));
  });

  test("Should receive TABLE_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.TABLE_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.TABLE_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.TABLE_UPDATED, {}]}));
  });

  test("Should receive TABLE_BULK_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.TABLE_BULK_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.TABLE_BULK_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.TABLE_BULK_UPDATED, {}]}));
  });

  test("Should receive CARD_ACTIVATION_REQUESTED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.CARD_ACTIVATION_REQUESTED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.CARD_ACTIVATION_REQUESTED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.CARD_ACTIVATION_REQUESTED, {}]}));
  });

  test("Should receive CARD_ENQUIRY_REQUESTED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.CARD_ENQUIRY_REQUESTED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.CARD_ENQUIRY_REQUESTED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.CARD_ENQUIRY_REQUESTED, {}]}));
  });

  test("Should receive ORDER_PREPROCESSED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.ORDER_PREPROCESSED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.ORDER_PREPROCESSED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.ORDER_PREPROCESSED, {}]}));
  });

  test("Should receive LOCATION_SUBSCRIBED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.LOCATION_SUBSCRIBED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.LOCATION_SUBSCRIBED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.LOCATION_SUBSCRIBED, {}]}));
  });

  test("Should receive LOCATION_HOURS_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.LOCATION_HOURS_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.LOCATION_HOURS_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.LOCATION_HOURS_UPDATED, {}]}));
  });

  test("Should receive APP_MENU_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.APP_MENU_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.APP_MENU_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.APP_MENU_UPDATED, {}]}));
  });

  test("Should receive APP_MENU_ITEM_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.APP_MENU_ITEM_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.APP_MENU_ITEM_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.APP_MENU_ITEM_UPDATED, {}]}));
  });

  test("Should receive LOYALTY_CHECKIN_CREATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.LOYALTY_CHECKIN_CREATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.LOYALTY_CHECKIN_CREATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.LOYALTY_CHECKIN_CREATED, {}]}));
  });

  test("Should receive LOYALTY_CHECKIN_UPDATED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.LOYALTY_CHECKIN_UPDATED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.LOYALTY_CHECKIN_UPDATED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.LOYALTY_CHECKIN_UPDATED, {}]}));
  });

  test("Should receive LOYALTY_CHECKIN_DELETED event", (done) => {
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebsocketEvents.LOYALTY_CHECKIN_DELETED],
      () => {
        doshii.unsubscribeFromWebsocketEvents(subscriber, [WebsocketEvents.LOYALTY_CHECKIN_DELETED]);
        done();
      }
    );

    ws.send(JSON.stringify({emit: [WebsocketEvents.LOYALTY_CHECKIN_DELETED, {}]}));
  });
});
