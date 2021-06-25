import { OrderRequest, OrderStatus } from "../lib";

export const sampleOrderRequest: OrderRequest = {
  order: {
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
                    price: "1000",
                  },
                ],
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
                price: "1000",
              },
            ],
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
    log: {
      employeeId: 123,
      employeePosRef: "123",
      employeeName: "John Doe",
      deviceRef: "123",
      deviceName: "MODEL A1",
      area: "Main dining hall",
    },
  },
  consumer: {
    name: "Tony",
    email: "user@test.com",
    phone: "+61415123456",
    marketingOptIn: true,
    address: {
      line1: "520 Bourke St",
      line2: "Level 1",
      city: "Melbourne",
      state: "VIC",
      postalCode: "3000",
      country: "AU",
      notes: "string",
    },
  },
  transactions: [
    {
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
    },
  ],
  members: ["123-456-789", "456-789-123"],
  posTerminalId: "123",
};

export const sampleOrderResponse = {
  id: "1634",
  posRef: "pos-12345678",
  externalOrderRef: "AQN-1234",
  deliveryOrderId: "XGH-4528-JTW",
  locationId: "Xuy8K3a0",
  checkinId: "3",
  manuallyProcessed: false,
  mealPhase: "ordered",
  status: "accepted",
  type: "pickup",
  notes: "Deliver to back door",
  revenueCentre: "123",
  requiredAt: "2019-01-01T12:00:00.000Z",
  availableEta: "2019-01-01T12:00:00.000Z",
  items: [
    {
      uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
      posId: "123",
      name: "Toasted Sourdough Bread & Eggs",
      quantity: 1,
      description: "Just ye old classic",
      unitPrice: "1100",
      totalBeforeSurcounts: "1100",
      totalAfterSurcounts: "1100",
      lastAction: {
        logId: "f52e2b12-9b13-4113-bb49-3cfacad02545",
        employeeId: "1",
        employeeName: "Fred Bloggs",
        employeePosRef: "432324tgr",
        deviceRef: "213-iPad",
        deviceName: "Dining Room iPad 1",
        area: "Dining Room",
        appId: "12",
        appName: "Fred's Cool Ordering App",
        audit: "accepted => complete",
        action: [
          "Item ID (bd9e565a-affe-4f7d-9dc6-728151647af0) item_created",
          "order_updated",
        ],
        performedAt: "2019-01-01T12:00:00.000Z",
      },
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
                  price: "1000",
                },
              ],
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
              price: "1000",
            },
          ],
        },
      ],
      rewardRef: "543-765-987",
    },
  ],
  unapprovedItems: [
    {
      uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
      posId: "123",
      status: "pending",
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
                  price: "1000",
                },
              ],
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
              price: "1000",
            },
          ],
        },
      ],
    },
  ],
  consumer: {
    name: "Tony",
    email: "user@test.com",
    phone: "+61415123456",
    marketingOptIn: true,
    address: {
      line1: "520 Bourke St",
      line2: "Level 1",
      city: "Melbourne",
      state: "VIC",
      postalCode: "3000",
      country: "AU",
      notes: "string",
    },
  },
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
  checkin: {
    id: "123",
    status: "accepted",
    ref: "813234",
    tableNames: ["Table 1"],
    covers: 4,
    bookingId: "765",
    completedAt: null,
    consumer: {
      name: "Tony",
      email: "user@test.com",
      phone: "+61415123456",
      marketingOptIn: true,
      address: {
        line1: "520 Bourke St",
        line2: "Level 1",
        city: "Melbourne",
        state: "VIC",
        postalCode: "3000",
        country: "AU",
        notes: "string",
      },
    },
    rejectionCode: "CH01",
    rejectionReason: "Table in use",
    posTerminalId: "Wsd22dXw2",
    updatedAt: "2019-01-01T12:00:00.000Z",
    createdAt: "2019-01-01T12:00:00.000Z",
    uri: "https://sandbox.doshii.co/partner/v3/checkins/123",
  },
  rejectionCode: "O1",
  delivery: {
    status: "delivering",
    displayId: "string",
    phase: "Vehicle Dispatched",
    failedReason: "string",
    deliveryEta: "2019-01-01T12:00:00.000Z",
    driverName: "Jack Brabham",
    driverPhone: "12345678",
    trackingUrl: "https://delivery.app/tracking/12345",
  },
  transactions: [
    {
      id: "124",
      orderId: "112",
      reference: "23ad34-45623f-768",
      invoice: "INV2245",
      method: "mastercard",
      amount: "1000",
      tip: 0,
      trn: "100412786589",
      acceptLess: false,
      partnerInitiated: true,
      prepaid: true,
      rejectionCode: "P1",
      rejectionReason: "Insufficient funds",
      version: "AJHBFjAKJFE3fnj33njj",
      surcount: [
        {
          posId: "123",
          name: "Item name",
          description: "Item description",
          amount: 1000,
          type: "absolute",
          value: "1000",
        },
      ],
      updatedAt: "2019-01-01T12:00:00.000Z",
      createdAt: "2019-01-01T12:00:00.000Z",
      uri: "https://sandbox.doshii.co/partner/v3/transactions/124",
      status: "requested",
      linkedTrxId: "123",
      createdByApp: "123",
      processedByApp: "6",
      posTerminalId: "123",
      requestedAppId: "123",
    },
  ],
  rejectionReason: "string",
  preorderBookingId: "string",
  posTerminalId: "Wsd22dXw2",
  posDisplayId: "123-456",
  posCreatedAt: "2019-01-01T12:00:00.000Z",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  version: "iwgjr2NJ014",
  uri: "https://sandbox.doshii.co/partner/v3/orders/1634",
  transactionsUri:
    "https://sandbox.doshii.co/partner/v3/orders/1634/transactions",
  log: "https://sandbox.doshii.co/partner/v3/orders/1634/logs",
};

export const sampleOrderResponses = {
  count: 12,
  offset: 12,
  limit: 50,
  rows: [
    {
      id: "1634",
      posRef: "pos-12345678",
      externalOrderRef: "AQN-1234",
      deliveryOrderId: "XGH-4528-JTW",
      locationId: "Xuy8K3a0",
      checkinId: "3",
      manuallyProcessed: false,
      mealPhase: "ordered",
      status: "accepted",
      type: "pickup",
      notes: "Deliver to back door",
      revenueCentre: "123",
      requiredAt: "2019-01-01T12:00:00.000Z",
      availableEta: "2019-01-01T12:00:00.000Z",
      items: [
        {
          uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
          posId: "123",
          name: "Toasted Sourdough Bread & Eggs",
          quantity: 1,
          description: "Just ye old classic",
          unitPrice: "1100",
          totalBeforeSurcounts: "1100",
          totalAfterSurcounts: "1100",
          lastAction: {
            logId: "f52e2b12-9b13-4113-bb49-3cfacad02545",
            employeeId: "1",
            employeeName: "Fred Bloggs",
            employeePosRef: "432324tgr",
            deviceRef: "213-iPad",
            deviceName: "Dining Room iPad 1",
            area: "Dining Room",
            appId: "12",
            appName: "Fred's Cool Ordering App",
            audit: "accepted => complete",
            action: [
              "Item ID (bd9e565a-affe-4f7d-9dc6-728151647af0) item_created",
              "order_updated",
            ],
            performedAt: "2019-01-01T12:00:00.000Z",
          },
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
                      price: "1000",
                    },
                  ],
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
                  price: "1000",
                },
              ],
            },
          ],
          rewardRef: "543-765-987",
        },
      ],
      unapprovedItems: [
        {
          uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
          posId: "123",
          status: "pending",
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
                      price: "1000",
                    },
                  ],
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
                  price: "1000",
                },
              ],
            },
          ],
        },
      ],
      consumer: {
        name: "Tony",
        email: "user@test.com",
        phone: "+61415123456",
        marketingOptIn: true,
        address: {
          line1: "520 Bourke St",
          line2: "Level 1",
          city: "Melbourne",
          state: "VIC",
          postalCode: "3000",
          country: "AU",
          notes: "string",
        },
      },
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
      checkin: {
        id: "123",
        status: "accepted",
        ref: "813234",
        tableNames: ["Table 1"],
        covers: 4,
        bookingId: "765",
        completedAt: null,
        consumer: {
          name: "Tony",
          email: "user@test.com",
          phone: "+61415123456",
          marketingOptIn: true,
          address: {
            line1: "520 Bourke St",
            line2: "Level 1",
            city: "Melbourne",
            state: "VIC",
            postalCode: "3000",
            country: "AU",
            notes: "string",
          },
        },
        rejectionCode: "CH01",
        rejectionReason: "Table in use",
        posTerminalId: "Wsd22dXw2",
        updatedAt: "2019-01-01T12:00:00.000Z",
        createdAt: "2019-01-01T12:00:00.000Z",
        uri: "https://sandbox.doshii.co/partner/v3/checkins/123",
      },
      rejectionCode: "O1",
      delivery: {
        status: "delivering",
        displayId: "string",
        phase: "Vehicle Dispatched",
        failedReason: "string",
        deliveryEta: "2019-01-01T12:00:00.000Z",
        driverName: "Jack Brabham",
        driverPhone: "12345678",
        trackingUrl: "https://delivery.app/tracking/12345",
      },
      transactions: [
        {
          id: "124",
          orderId: "112",
          reference: "23ad34-45623f-768",
          invoice: "INV2245",
          method: "mastercard",
          amount: "1000",
          tip: 0,
          trn: "100412786589",
          acceptLess: false,
          partnerInitiated: true,
          prepaid: true,
          rejectionCode: "P1",
          rejectionReason: "Insufficient funds",
          version: "AJHBFjAKJFE3fnj33njj",
          surcount: [
            {
              posId: "123",
              name: "Item name",
              description: "Item description",
              amount: 1000,
              type: "absolute",
              value: "1000",
            },
          ],
          updatedAt: "2019-01-01T12:00:00.000Z",
          createdAt: "2019-01-01T12:00:00.000Z",
          uri: "https://sandbox.doshii.co/partner/v3/transactions/124",
          status: "requested",
          linkedTrxId: "123",
          createdByApp: "123",
          processedByApp: "6",
          posTerminalId: "123",
          requestedAppId: "123",
        },
      ],
      rejectionReason: "string",
      preorderBookingId: "string",
      posTerminalId: "Wsd22dXw2",
      posDisplayId: "123-456",
      posCreatedAt: "2019-01-01T12:00:00.000Z",
      updatedAt: "2019-01-01T12:00:00.000Z",
      createdAt: "2019-01-01T12:00:00.000Z",
      version: "iwgjr2NJ014",
      uri: "https://sandbox.doshii.co/partner/v3/orders/1634",
      transactionsUri:
        "https://sandbox.doshii.co/partner/v3/orders/1634/transactions",
      log: "https://sandbox.doshii.co/partner/v3/orders/1634/logs",
    },
  ],
};

export const sampleBookingResponse = {
  id: "129",
  status: "pending",
  tableNames: ["Table 1"],
  date: "2019-01-01T12:00:00.000Z",
  covers: 4,
  notes: "Customer would like to be seated near window",
  ref: "813889491",
  consumer: {
    name: "Tony",
    email: "user@test.com",
    phone: "+61415123456",
    marketingOptIn: true,
    address: {
      line1: "520 Bourke St",
      line2: "Level 1",
      city: "Melbourne",
      state: "VIC",
      postalCode: "3000",
      country: "AU",
      notes: "string",
    },
  },
  checkin: {
    id: "123",
    status: "accepted",
    ref: "813234",
    tableNames: ["Table 1"],
    covers: 4,
    bookingId: "765",
    completedAt: null,
    consumer: {
      name: "Tony",
      email: "user@test.com",
      phone: "+61415123456",
      marketingOptIn: true,
      address: {
        line1: "520 Bourke St",
        line2: "Level 1",
        city: "Melbourne",
        state: "VIC",
        postalCode: "3000",
        country: "AU",
        notes: "string",
      },
    },
    rejectionCode: "CH01",
    rejectionReason: "Table in use",
    posTerminalId: "Wsd22dXw2",
    updatedAt: "2019-01-01T12:00:00.000Z",
    createdAt: "2019-01-01T12:00:00.000Z",
    uri: "https://sandbox.doshii.co/partner/v3/checkins/123",
  },
  posTerminalId: "Wsd22dXw2",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/bookings/129",
  version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
};

export const sampleBookingResponses = {
  count: 12,
  offset: 12,
  limit: 50,
  rows: [
    {
      id: "129",
      status: "pending",
      tableNames: ["Table 1"],
      date: "2019-01-01T12:00:00.000Z",
      covers: 4,
      notes: "Customer would like to be seated near window",
      ref: "813889491",
      consumer: {
        name: "Tony",
        email: "user@test.com",
        phone: "+61415123456",
        marketingOptIn: true,
        address: {
          line1: "520 Bourke St",
          line2: "Level 1",
          city: "Melbourne",
          state: "VIC",
          postalCode: "3000",
          country: "AU",
          notes: "string",
        },
      },
      checkin: {
        id: "123",
        status: "accepted",
        ref: "813234",
        tableNames: ["Table 1"],
        covers: 4,
        bookingId: "765",
        completedAt: null,
        consumer: {
          name: "Tony",
          email: "user@test.com",
          phone: "+61415123456",
          marketingOptIn: true,
          address: {
            line1: "520 Bourke St",
            line2: "Level 1",
            city: "Melbourne",
            state: "VIC",
            postalCode: "3000",
            country: "AU",
            notes: "string",
          },
        },
        rejectionCode: "CH01",
        rejectionReason: "Table in use",
        posTerminalId: "Wsd22dXw2",
        updatedAt: "2019-01-01T12:00:00.000Z",
        createdAt: "2019-01-01T12:00:00.000Z",
        uri: "https://sandbox.doshii.co/partner/v3/checkins/123",
      },
      posTerminalId: "Wsd22dXw2",
      updatedAt: "2019-01-01T12:00:00.000Z",
      createdAt: "2019-01-01T12:00:00.000Z",
      uri: "https://sandbox.doshii.co/partner/v3/bookings/129",
      version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
    },
  ],
};

export const sampleCheckinResponse = {
  id: "123",
  status: "accepted",
  ref: "813234",
  tableNames: ["Table 1"],
  covers: 4,
  bookingId: "765",
  completedAt: null,
  consumer: {
    name: "Tony",
    email: "user@test.com",
    phone: "+61415123456",
    marketingOptIn: true,
    address: {
      line1: "520 Bourke St",
      line2: "Level 1",
      city: "Melbourne",
      state: "VIC",
      postalCode: "3000",
      country: "AU",
      notes: "string",
    },
  },
  rejectionCode: "CH01",
  rejectionReason: "Table in use",
  posTerminalId: "Wsd22dXw2",
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/checkins/123",
};

export const sampleCheckinRequest = {
  ref: "813234",
  tableNames: ["Table 1"],
  covers: 4,
  completedAt: null,
  log: {
    employeeId: 123,
    employeePosRef: "123",
    employeeName: "John Doe",
    deviceRef: "123",
    deviceName: "MODEL A1",
    area: "Main dining hall",
  },
  consumer: {
    name: "Tony",
    email: "user@test.com",
    phone: "+61415123456",
    marketingOptIn: true,
    address: {
      line1: "520 Bourke St",
      line2: "Level 1",
      city: "Melbourne",
      state: "VIC",
      postalCode: "3000",
      country: "AU",
      notes: "string",
    },
  },
};

export const sampleLogsResponse = {
  logId: "f52e2b12-9b13-4113-bb49-3cfacad02545",
  employeeId: "1",
  employeeName: "Fred Bloggs",
  employeePosRef: "432324tgr",
  deviceRef: "213-iPad",
  deviceName: "Dining Room iPad 1",
  area: "Dining Room",
  appId: "12",
  appName: "Fred's Cool Ordering App",
  audit: "accepted => complete",
  action: [
    "Item ID (bd9e565a-affe-4f7d-9dc6-728151647af0) item_created",
    "order_updated",
  ],
  performedAt: "2019-01-01T12:00:00.000Z",
};

export const sampleTransactionRequest = {
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

export const sampleTransactionResponse = {
  id: "124",
  orderId: "112",
  reference: "23ad34-45623f-768",
  invoice: "INV2245",
  method: "mastercard",
  amount: "1000",
  tip: 0,
  trn: "100412786589",
  acceptLess: false,
  partnerInitiated: true,
  prepaid: true,
  rejectionCode: "P1",
  rejectionReason: "Insufficient funds",
  version: "AJHBFjAKJFE3fnj33njj",
  surcount: [
    {
      posId: "123",
      name: "Item name",
      description: "Item description",
      amount: 1000,
      type: "absolute",
      value: "1000",
    },
  ],
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/transactions/124",
  status: "requested",
  linkedTrxId: "123",
  createdByApp: "123",
  processedByApp: "6",
  posTerminalId: "123",
  requestedAppId: "123",
};
