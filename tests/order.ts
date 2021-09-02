import Doshii, {
  OrderStatus,
  MealPhase,
  DeliveryStatus,
  AddItemToOrderRequest,
  OrderPreprocess,
} from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  sampleLogsResponse,
  sampleOrderRequest,
  sampleOrderResponse,
  sampleOrderResponses,
  sampleTransactionRequest,
  sampleTransactionResponse,
} from "./sharedSamples";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleItemToAddToOrder: AddItemToOrderRequest = {
  posId: "123",
  name: "Toasted Sourdough Bread & Eggs",
  quantity: 1,
  description: "Just ye old classic",
  unitPrice: "1100",
  totalBeforeSurcounts: "1100",
  totalAfterSurcounts: "1100",
  tags: ["tag"],
  type: "bundle",
  includedItems: [
    {
      name: "Item name",
      posId: "123",
      quantity: 1,
      unitPrice: "1000",
      options: [
        {
          posId: "123",
          name: "Option name",
          variants: [
            {
              posId: "123",
              name: "Variant name",
              price: 1000,
            },
          ],
          min: '0',
          max: '0'
        },
      ],
    },
  ],
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
  taxes: [
    {
      posId: "123",
      name: "Item name",
      amount: "1000",
      type: "absolute",
      taxType: "exclusive",
      value: "1000",
    },
  ],
  options: [
    {
      posId: "123",
      name: "Option name",
      variants: [
        {
          posId: "123",
          name: "Variant name",
          price: 1000,
        },
      ],
      min: '0',
      max: '0'
    },
  ],
};

const sampleOrderPreprocessRequest: OrderPreprocess = {
  checkinId: "3",
  externalOrderRef: "AQN-1234",
  manuallyProcessed: false,
  status: OrderStatus.PENDING,
  type: "pickup",
  revenueCentre: "123",
  notes: "Deliver to back door",
  requiredAt: "2019-01-01T12:00:00.000Z",
  availableEta: "2019-01-01T12:00:00.000Z",
  items: [
    {
      posId: "123",
      name: "Toasted Sourdough Bread & Eggs",
      quantity: 1,
      description: "Just ye old classic",
      unitPrice: "1100",
      totalBeforeSurcounts: "1100",
      totalAfterSurcounts: "1100",
      tags: ["tag"],
      type: "bundle",
      includedItems: [
        {
          name: "Item name",
          posId: "123",
          quantity: 1,
          unitPrice: "1000",
          options: [
            {
              posId: "123",
              name: "Option name",
              variants: [
                {
                  posId: "123",
                  name: "Variant name",
                  price: 1000,
                },
              ],
              min: '0',
              max: '0'
            },
          ],
        },
      ],
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
      taxes: [
        {
          posId: "123",
          name: "Item name",
          amount: "1000",
          type: "absolute",
          taxType: "exclusive",
          value: "1000",
        },
      ],
      options: [
        {
          posId: "123",
          name: "Option name",
          variants: [
            {
              posId: "123",
              name: "Variant name",
              price: 1000,
            },
          ],
          min: '0',
          max: '0'
        },
      ],
    },
  ],
  surcounts: [
    {
      posId: "123",
      name: "Item name",
      description: "Item description",
      amount: 1000,
      type: "absolute",
      value: 1000,
    },
  ],
  taxes: [
    {
      posId: "123",
      name: "Item name",
      amount: "1000",
      type: "absolute",
      taxType: "exclusive",
      value: "1000",
    },
  ],
  log: {
    employeeId: 123,
    employeePosRef: "123",
    employeeName: "John Doe",
    deviceRef: "123",
    deviceName: "MODEL A1",
    area: "Main dining hall",
  },
};

describe("Order", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all orders", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponses });
    await expect(doshii.order.getAll(locationId)).resolves.toMatchObject(
      sampleOrderResponses
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific order", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponse });
    const orderId = "Order324";
    await expect(
      doshii.order.getOne(locationId, orderId)
    ).resolves.toMatchObject(sampleOrderResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}`,
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for orders with filters", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponses });
    await expect(
      doshii.order.get(locationId, "", {
        status: [OrderStatus.PENDING, OrderStatus.ACCEPTED],
        posRef: "pos234",
        externalOrderRef: "order234",
        from: new Date(Date.UTC(2021, 0, 1)),
        posFrom: new Date(Date.UTC(2021, 0, 1)),
        to: new Date(Date.UTC(2021, 0, 2)),
        posTo: new Date(Date.UTC(2021, 0, 2)),
        sort: "asc",
      })
    ).resolves.toMatchObject(sampleOrderResponses);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders",
      params: {
        from: 1609459200,
        to: 1609545600,
        posFrom: 1609459200,
        posTo: 1609545600,
        sort: "asc",
        posRef: "pos234",
        externalOrderRef: "order234",
        status: [OrderStatus.PENDING, OrderStatus.ACCEPTED],
      },
    });
  });

  test("Should request for new order creation", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponse });
    await expect(
      doshii.order.createOrder(locationId, sampleOrderRequest)
    ).resolves.toMatchObject(sampleOrderResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/orders",
      data: sampleOrderRequest,
    });
  });

  test("Should request for order update", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponses });
    const orderId = "order124";
    const data = {
      status: OrderStatus.ACCEPTED,
      mealPhase: MealPhase.ORDERED,
      version: "12",
      log: {
        employeeId: 123,
        employeePosRef: "123",
        employeeName: "John Doe",
        deviceRef: "123",
        deviceName: "MODEL A1",
        area: "Main dining hall",
      },
    };

    await expect(
      doshii.order.update(locationId, orderId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}`,
      data,
    });
  });

  test("Should request for order delivery update", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponse });
    const data = {
      deliveryOrderId: "string",
      displayId: "string",
      status: DeliveryStatus.DELIVERED,
      phase: "Vehicle Dispatched",
      failedReason: "string",
      deliveryEta: "2019-01-01T12:00:00.000Z",
      trackingUrl: "https://delivery.app/tracking/12345",
      driverName: "Jack Brabham",
      driverPhone: "12345678",
      version: "1",
    };
    const orderId = "order124";
    await expect(
      doshii.order.updateDelivery(locationId, orderId, data)
    ).resolves.toMatchObject(sampleOrderResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/delivery`,
      data,
    });
  });

  test("Should request for order logs", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleLogsResponse });
    const orderId = "order124";
    await expect(
      doshii.order.getLogs(locationId, orderId)
    ).resolves.toMatchObject(sampleLogsResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/logs`,
    });
  });

  test("Should request to add items to an order", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponse });
    const orderId = "234re";
    await expect(
      doshii.order.addItems(locationId, orderId, [sampleItemToAddToOrder])
    ).resolves.toMatchObject(sampleOrderResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/items`,
      data: [sampleItemToAddToOrder],
    });
  });

  test("Should request to remove items from an order", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponse });
    const orderId = "order124";
    const data = {
      cancelledItems: ["string"],
      version: "iwgjr2NJ014",
      log: {
        employeeId: 123,
        employeePosRef: "123",
        employeeName: "John Doe",
        deviceRef: "123",
        deviceName: "MODEL A1",
        area: "Main dining hall",
      },
    };
    await expect(
      doshii.order.removeItems(locationId, orderId, data)
    ).resolves.toMatchObject(sampleOrderResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "DELETE",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/items`,
      data,
    });
  });

  test("Should request to preprocess order", async () => {
    const response = {
      id: "1634",
      locationId: "Xuy8K3a0",
      status: "pending",
      createdAt: "2019-01-01T12:00:00.000Z",
    };
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: response });
    await expect(
      doshii.order.preprocess(locationId, sampleOrderPreprocessRequest)
    ).resolves.toMatchObject(response);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/preprocess`,
      data: sampleOrderPreprocessRequest,
    });
  });

  test("Should request to create transaction from an order", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleTransactionResponse });
    const orderId = "order234";
    await expect(
      doshii.order.createTransaction(
        locationId,
        orderId,
        sampleTransactionRequest
      )
    ).resolves.toMatchObject(sampleTransactionResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/transactions`,
      data: sampleTransactionRequest,
    });
  });

  test("Should request transactions for an order", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleTransactionResponse] });
    const orderId = "order234";
    await expect(
      doshii.order.getTransactions(locationId, orderId)
    ).resolves.toMatchObject([sampleTransactionResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/orders/${orderId}/transactions`,
    });
  });
});
