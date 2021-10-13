import Doshii, {
  LoyaltyCardRequest,
  LoyaltyCheckinRequest,
  LoyaltyCheckinRetrievalFilters,
  LoyaltyMemberActivityRequest,
} from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
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
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all checkins with and without filters", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleLoyaltyCheckinResponse] });

    await expect(
      doshii.loyalty.getAllCheckins(locationId)
    ).resolves.toMatchObject([sampleLoyaltyCheckinResponse]);

    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/loyalty/checkins",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific checkin", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleLoyaltyCheckinResponse });
    const checkinId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getOneCheckin(locationId, checkinId)
    ).resolves.toMatchObject(sampleLoyaltyCheckinResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/checkins/${checkinId}`,
    });

    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should pass on the options as params for retrieving checkins", async () => {
    const filters: LoyaltyCheckinRetrievalFilters = {
      from: new Date(Date.UTC(2021, 0, 1)),
      to: new Date(Date.UTC(2021, 0, 2)),
      offset: 2,
      limit: 100,
      sort: "asc",
    };
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleLoyaltyCheckinResponse] });
    await expect(
      doshii.loyalty.getAllCheckins(locationId, filters)
    ).resolves.toMatchObject([sampleLoyaltyCheckinResponse]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/checkins`,
      params: {
        from: 1609459200,
        to: 1609545600,
        limit: 100,
        offset: 2,
        sort: "asc",
      },
    });
  });

  test("Should reject the promise if request fails", async () => {
    jest
      .spyOn(axios, "request")
      .mockRejectedValue({ status: 500, error: "failed" });
    await expect(doshii.loyalty.getCheckins(locationId)).rejects.toBeDefined();
  });

  test("Should request for a new checkin", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleLoyaltyCheckinResponse });
    await expect(
      doshii.loyalty.createCheckin(locationId, sampleLoyaltyCheckinRequest)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "POST",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/loyalty/checkins",
      data: sampleLoyaltyCheckinRequest,
    });
  });

  test("Should request for a checkin update", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleLoyaltyCheckinResponse });
    const checkinId = "aklsdhfj90834";
    const data = sampleLoyaltyCheckinRequest;
    await expect(
      doshii.loyalty.updateCheckin(locationId, checkinId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/checkins/${checkinId}`,
      data,
    });
  });

  test("Should request for a checkin removal", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: {
        message: "The requested loyalty checkin has been removed",
      },
    });
    const checkinId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.deleteCheckin(locationId, checkinId)
    ).resolves.toMatchObject({
      message: "The requested loyalty checkin has been removed",
    });
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "DELETE",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/checkins/${checkinId}`,
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
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: response });
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
    await expect(
      doshii.loyalty.respondToEnquiry(locationId, enquiryId, data)
    ).resolves.toMatchObject(response);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/members/enquiry/${enquiryId}`,
      data,
    });
  });

  test("Should request for activity register response", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleLoyaltyMemberActivityResponse,
    });
    const activityId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.respondToActivityRegisterRequest(
        locationId,
        activityId,
        sampleLoyaltyMemberActivityRequest
      )
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/members/activity/${activityId}`,
      data: sampleLoyaltyMemberActivityRequest,
    });
  });

  test("Should request for card enquiry requests", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleLoyaltyCardResponse,
    });
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getCardEnquiryRequest(locationId, requestId)
    ).resolves.toMatchObject(sampleLoyaltyCardResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/enquiry/${requestId}`,
    });
  });

  test("Should request for card enquiry response", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleLoyaltyCardResponse,
    });
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.respondToCardEnquiry(
        locationId,
        requestId,
        sampleLoyaltyCardRequest
      )
    ).resolves.toMatchObject(sampleLoyaltyCardResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/enquiry/${requestId}`,
      data: sampleLoyaltyCardRequest,
    });
  });

  test("Should request for card activation requests", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleLoyaltyCardResponse,
    });
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getCardActivationRequest(locationId, requestId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/activation/${requestId}`,
    });
  });

  test("Should request for card activation response", async () => {
    const requestSpy = jest.spyOn(axios, "request").mockResolvedValue({
      status: 200,
      data: sampleLoyaltyCardResponse,
    });
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.respondToCardActivation(
        locationId,
        requestId,
        sampleLoyaltyCardRequest
      )
    ).resolves.toMatchObject(sampleLoyaltyCardResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/activation/${requestId}`,
      data: sampleLoyaltyCardRequest,
    });
  });
});
