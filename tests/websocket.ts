import Doshii, { WebSocketEvents } from "../lib";
import WebSocket from "ws";

jest.mock("ws");

describe("Websocket", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let wsSendSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, {
      sandbox: true,
      pingInterval: 500,
    });
    wsSendSpy = jest
      .spyOn(WebSocket.prototype, "send")
      .mockImplementation(jest.fn());
    Date.now = jest.fn().mockReturnValue(111222333);
  });

  test("Should open websocket, send ping when a new subscriber is added and close ws when unsubscribed", async () => {
    const eventHandlers: any = {};
    const wsSpy = jest
      .spyOn(WebSocket.prototype, "on")
      .mockImplementation((event: any, handler: any): any => {
        eventHandlers[event] = handler;
      });
    const subscriber = doshii.subscribeToWebsockeEvents(
      [WebSocketEvents.PONG],
      jest.fn()
    );
    expect(wsSpy).toBeCalledWith("open", eventHandlers["open"]);
    eventHandlers["open"]();
    expect(wsSendSpy).toHaveBeenCalledWith(
      JSON.stringify({ doshii: { ping: 111222333, version: "1.2.3" } })
    );
    doshii.unsubscribeFromWebsocketEvents(subscriber, [WebSocketEvents.PONG]);
    jest.useFakeTimers();
    jest.runAllTimers();
    expect(wsSpy).toBeCalledWith("close", eventHandlers["close"]);
  });
});
