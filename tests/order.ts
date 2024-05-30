import Doshii, {
  OrderStatus,
  MealPhase,
  DeliveryStatus,
  AddItemToOrderRequest,
  OrderPreprocess,
} from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";
import {
  sampleOrderRequest,
  sampleOrderResponse,
  sampleOrderResponses,
  sampleTransactionRequest,
  sampleTransactionResponse,
} from "./sharedSamples";

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
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    "doshii-location-id": locationId,
    authorization: "Bearer signedJwt",
    "content-type": "application/json",
  };

  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.restore();
    nock.enableNetConnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  afterEach(() => {
    nock.isDone();
    nock.cleanAll();
  });

  test("Should request for all orders", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/orders`).reply(200, sampleOrderResponses);

    await expect(doshii.order.getAll(locationId)).resolves.toMatchObject(
      sampleOrderResponses
    );

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific order", async () => {
    const orderId = "Order324";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/orders/${orderId}`).reply(200, sampleOrderResponse);

    await expect(
      doshii.order.getOne(locationId, orderId)
    ).resolves.toMatchObject(sampleOrderResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for orders with filters", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/orders`)
    .query({
      from: 1609459200,
      to: 1609545600,
      posFrom: 1609459200,
      posTo: 1609545600,
      sort: "asc",
      posRef: "pos234",
      externalOrderRef: "order234",
      status: [OrderStatus.PENDING, OrderStatus.ACCEPTED].join(','),
    })
    .reply(200, sampleOrderResponses);

    await expect(
      doshii.order.getAll(locationId, {
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
  });

  test("Should request for new order creation", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .post(`/partner/v3/orders`, _.matches(sampleOrderRequest))
    .reply(200, sampleOrderResponse);

    await expect(
      doshii.order.createOrder(locationId, sampleOrderRequest)
    ).resolves.toMatchObject(sampleOrderResponse);
  });

  test("Should request for order update", async () => {
    const orderId = "order124";

    const data = {
      status: OrderStatus.ACCEPTED,
      mealPhase: MealPhase.ORDERED,
      version: "12",
      log: {
        employeePosRef: "123",
        employeeName: "John Doe",
        deviceRef: "123",
        deviceName: "MODEL A1",
        area: "Main dining hall",
      },
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/orders/${orderId}`, _.matches(data))
    .reply(200, sampleOrderResponses);

    await expect(
      doshii.order.update(locationId, orderId, data)
    ).resolves.toBeDefined();
  });

  test("Should request for order delivery update", async () => {
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

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/orders/${orderId}/delivery`, _.matches(data))
    .reply(200, sampleOrderResponse);

    await expect(
      doshii.order.updateDelivery(locationId, orderId, data)
    ).resolves.toMatchObject(sampleOrderResponse);
  });

  test("Should request to add items to an order", async () => {
    const orderId = "234re";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .post(`/partner/v3/orders/${orderId}/items`, _.matches([sampleItemToAddToOrder]))
    .reply(200, sampleOrderResponse);

    await expect(
      doshii.order.addItems(locationId, orderId, [sampleItemToAddToOrder])
    ).resolves.toMatchObject(sampleOrderResponse);
  });

  test("Should request to remove items from an order", async () => {
    const orderId = "order124";
    const data = {
      cancelledItems: ["string"],
      version: "iwgjr2NJ014",
      log: {
        employeePosRef: "123",
        employeeName: "John Doe",
        deviceRef: "123",
        deviceName: "MODEL A1",
        area: "Main dining hall",
      },
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .delete(`/partner/v3/orders/${orderId}/items`, _.matches(data))
    .reply(200, sampleOrderResponse);

    await expect(
      doshii.order.removeItems(locationId, orderId, data)
    ).resolves.toMatchObject(sampleOrderResponse);
  });

  test("Should request to preprocess order", async () => {
    const response = {
      id: "1634",
      locationId: "Xuy8K3a0",
      status: "pending",
      createdAt: "2019-01-01T12:00:00.000Z",
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .post(`/partner/v3/orders/preprocess`, _.matches(sampleOrderPreprocessRequest))
    .reply(200, response);

    await expect(
      doshii.order.preprocess(locationId, sampleOrderPreprocessRequest)
    ).resolves.toMatchObject(response);
  });

  test("Should request to create transaction from an order", async () => {
    const orderId = "order234";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .post(`/partner/v3/orders/${orderId}/transactions`, _.matches(sampleTransactionRequest))
    .reply(200, sampleTransactionResponse);

    await expect(
      doshii.order.createTransaction(
        locationId,
        orderId,
        sampleTransactionRequest
      )
    ).resolves.toMatchObject(sampleTransactionResponse);
  });

  test("Should request transactions for an order", async () => {
    const orderId = "order234";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/orders/${orderId}/transactions`)
    .reply(200, [sampleTransactionResponse]);

    await expect(
      doshii.order.getTransactions(locationId, orderId)
    ).resolves.toMatchObject([sampleTransactionResponse]);
  });
});
