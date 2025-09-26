import Doshii, {
  LoyaltyCardRequest,
  LoyaltyCheckinRequest,
  LoyaltyCheckinRetrievalFilters,
  LoyaltyMemberActivityRequest,
} from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

const sampleLoyaltyCheckinRequest: LoyaltyCheckinRequest = {
  status: "active",
  member: {
    ref: "1653-4622-5634-2345",
    name: "Joe Bloggs",
    imageUri: "https://some.where.else/member/1653/4622.png",
  },
  rewards: {
    items: [
      {
        rewardRef: "543-765-987",
        uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
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
        rewardRef: "543-765-987",
        posId: "123",
        name: "Loyalty discount",
        description: "Reward discount description",
        amount: 1000,
        type: "absolute",
        value: 1000,
      },
    ],
  },
};

const sampleLoyaltyCheckinResponse = {
  id: 124,
  locationId: "Xuy8K3a0",
  status: "pending",
  member: {
    ref: "1653-4622-5634-2345",
    name: "Joe Bloggs",
    imageUri: "https://some.where.else/member/1653/4622.png",
  },
  rewards: {
    items: [
      {
        rewardRef: "543-765-987",
        uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
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
        rewardRef: "543-765-987",
        posId: "123",
        name: "Loyalty discount",
        description: "Reward discount description",
        amount: 1000,
        type: "absolute",
        value: "1000",
      },
    ],
  },
  rejectionReason: "string",
  createdAt: "2019-01-01T12:00:00.000Z",
  updatedAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/loyalty/checkins/124",
};

const sampleLoyaltyMemberActivityRequest: LoyaltyMemberActivityRequest = {
  status: "accepted",
  rejectionReason: "string",
  pointsEarned: 100,
  pointsBalance: 1000,
  message: "You have reached Gold status",
  rewards: {
    items: [
      {
        rewardRef: "543-765-987",
        uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
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
        rewardRef: "543-765-987",
        posId: "123",
        name: "Loyalty discount",
        description: "Reward discount description",
        amount: 1000,
        type: "absolute",
        value: 1000,
      },
    ],
  },
};

const sampleLoyaltyMemberActivityResponse = {
  id: 124,
  locationId: "Xuy8K3a0",
  posTerminalId: "Wsd22dXw2",
  status: "pending",
  memberRef: "1653-4622-5634-2345",
  orderId: "16873",
  rewards: {
    items: [
      {
        rewardRef: "543-765-987",
        uuid: "43g25532h235-f34f23f34f34-f3432g23g32",
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
        rewardRef: "543-765-987",
        posId: "123",
        name: "Loyalty discount",
        description: "Reward discount description",
        amount: 1000,
        type: "absolute",
        value: "1000",
      },
    ],
  },
  rejectionReason: "string",
  createdAt: "2019-01-01T12:00:00.000Z",
  updatedAt: "2019-01-01T12:00:00.000Z",
  uri: "https://sandbox.doshii.co/partner/v3/loyalty/members/activity/124",
  orderUri: "https://sandbox.doshii.co/partner/v3/orders/16873",
};

const sampleLoyaltyCardResponse = {
  id: 124,
  type: "giftcard",
  event: "card_enquiry",
  status: "pending",
  orderId: "123",
  amount: 1000,
  requestedAppId: "123",
  notes: "Some note",
  reference: "123",
  expiryDate: "2019-01-01T12:00:00.000Z",
  cancelledReason: "Technical issue",
  posTerminalId: "123",
  processedByApp: 1,
  uri: "https://sandbox.doshii.co/partner/v3/loyalty/cards/enquiry/124",
  createdAt: "2019-01-01T12:00:00.000Z",
  updatedAt: "2019-01-01T12:00:00.000Z",
};

const sampleLoyaltyCardRequest: LoyaltyCardRequest = {
  event: "card_enquiry",
  status: "complete",
  amount: 2000,
  expiryDate: "2019-01-01T12:00:00.000Z",
  reference: "1af533-23f342d-2342",
  cancelledReason: "Technical issue",
  log: {
    employeePosRef: "123",
    employeeName: "John Doe",
    deviceRef: "123",
    deviceName: "MODEL A1",
    area: "Main dining hall",
  },
};

describe("Loyalty", () => {
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

  test("Should request for all checkins with and without filters", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/loyalty/checkins`).reply(200, [sampleLoyaltyCheckinResponse]);

    await expect(
      doshii.loyalty.getAllCheckins(locationId)
    ).resolves.toMatchObject([sampleLoyaltyCheckinResponse]);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should request for a specific checkin", async () => {
    const checkinId = "aklsdhfj90834";
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/loyalty/checkins/${checkinId}`)
    .reply(200, sampleLoyaltyCheckinResponse);

    await expect(
      doshii.loyalty.getOneCheckin(locationId, checkinId)
    ).resolves.toMatchObject(sampleLoyaltyCheckinResponse);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should pass on the options as params for retrieving checkins", async () => {
    const filters: LoyaltyCheckinRetrievalFilters = {
      from: new Date(Date.UTC(2021, 0, 1)),
      to: new Date(Date.UTC(2021, 0, 2)),
      offset: 2,
      limit: 100,
      sort: "asc",
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/loyalty/checkins`)
    .query({
      from: 1609459200,
      to: 1609545600,
      limit: 100,
      offset: 2,
      sort: "asc",
    })
    .reply(200, [sampleLoyaltyCheckinResponse]);

    await expect(
      doshii.loyalty.getAllCheckins(locationId, filters)
    ).resolves.toMatchObject([sampleLoyaltyCheckinResponse]);
  });

  test("Should reject the promise if request fails", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(() => true).reply(500);

    await expect(doshii.loyalty.getCheckins(locationId)).rejects.toBeDefined();
  });

  test("Should request for a new checkin", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .post(`/partner/v3/loyalty/checkins`, _.matches(sampleLoyaltyCheckinRequest))
    .reply(200, sampleLoyaltyCheckinResponse);

    await expect(
      doshii.loyalty.createCheckin(locationId, sampleLoyaltyCheckinRequest)
    ).resolves.toBeDefined();
  });

  test("Should request for a checkin update", async () => {
    const checkinId = "aklsdhfj90834";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/loyalty/checkins/${checkinId}`, _.matches(sampleLoyaltyCheckinRequest))
    .reply(200, sampleLoyaltyCheckinResponse);

    await expect(
      doshii.loyalty.updateCheckin(locationId, checkinId, sampleLoyaltyCheckinRequest)
    ).resolves.toBeDefined();
  });

  test("Should request for a checkin removal", async () => {
    const checkinId = "aklsdhfj90834";
    
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .delete(`/partner/v3/loyalty/checkins/${checkinId}`)
    .reply(200, {
      message: "The requested loyalty checkin has been removed",
    });

    await expect(
      doshii.loyalty.deleteCheckin(locationId, checkinId)
    ).resolves.toMatchObject({
      message: "The requested loyalty checkin has been removed",
    });
  });

  test("Should request for enquiry response", async () => {
    const response = {
      id: 123,
      locationId: "Xuy8K3a0",
      posTerminalId: "Wsd22dXw2",
      createdAt: "2019-01-01T12:00:00.000Z",
      updatedAt: "2019-01-01T12:00:00.000Z",
    };

    const enquiryId = "aklsdhfj90834";

    const data = {
      members: [
        {
          ref: "1653-4622-5634-2345",
          name: "Joe Bloggs",
          email: "user@test.com",
          phone: "+61415123456",
        },
      ],
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/loyalty/members/enquiry/${enquiryId}`, _.matches(data))
    .reply(200, response);

    await expect(
      doshii.loyalty.respondToEnquiry(locationId, enquiryId, data)
    ).resolves.toMatchObject(response);
  });

  test("Should request for activity register response", async () => {
    const activityId = "aklsdhfj90834";
    
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/loyalty/members/activity/${activityId}`, _.matches(sampleLoyaltyMemberActivityRequest))
    .reply(200, sampleLoyaltyMemberActivityResponse);

    await expect(
      doshii.loyalty.respondToActivityRegisterRequest(
        locationId,
        activityId,
        sampleLoyaltyMemberActivityRequest
      )
    ).resolves.toBeDefined();
  });

  test("Should request for card enquiry requests", async () => {
    const requestId = "aklsdhfj90834";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/loyalty/cards/enquiry/${requestId}`)
    .reply(200, sampleLoyaltyCardResponse);

    await expect(
      doshii.loyalty.getCardEnquiryRequest(locationId, requestId)
    ).resolves.toMatchObject(sampleLoyaltyCardResponse);
  });

  test("Should request for card enquiry response", async () => {
    const requestId = "aklsdhfj90834";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/loyalty/cards/enquiry/${requestId}`, _.matches(sampleLoyaltyCardRequest))
    .reply(200, sampleLoyaltyCardResponse);

    await expect(
      doshii.loyalty.respondToCardEnquiry(
        locationId,
        requestId,
        sampleLoyaltyCardRequest
      )
    ).resolves.toMatchObject(sampleLoyaltyCardResponse);
  });

  test("Should request for card activation requests", async () => {
    const requestId = "aklsdhfj90834";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .get(`/partner/v3/loyalty/cards/activation/${requestId}`)
    .reply(200, sampleLoyaltyCardResponse);

    await expect(
      doshii.loyalty.getCardActivationRequest(locationId, requestId)
    ).resolves.toBeDefined();
  });

  test("Should request for card activation response", async () => {
    const requestId = "aklsdhfj90834";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    })
    .put(`/partner/v3/loyalty/cards/activation/${requestId}`, _.matches(sampleLoyaltyCardRequest))
    .reply(200, sampleLoyaltyCardResponse);

    await expect(
      doshii.loyalty.respondToCardActivation(
        locationId,
        requestId,
        sampleLoyaltyCardRequest
      )
    ).resolves.toMatchObject(sampleLoyaltyCardResponse);
  });
});
