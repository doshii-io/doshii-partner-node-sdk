import Doshii from "../lib/doshii";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;
  let requestSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
    requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: "success" });
  });

  test("Should request for checkins", async () => {
    await expect(doshii.loyalty.getCheckins(locationId)).resolves.toBeDefined();
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

    const checkinId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getCheckins(locationId, checkinId, {
        from: new Date("01-01-2021"),
        to: new Date("01-02-2021"),
        offset: 2,
        limit: 100,
      })
    ).resolves.toBeDefined();
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

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should pass on the options as params for retrieving checkins", async () => {
    await expect(
      doshii.loyalty.getCheckins(locationId, "", {
        from: new Date("01-01-2021"),
        to: new Date("01-02-2021"),
        offset: 2,
        limit: 100,
        sort: "asc",
      })
    ).resolves.toBeDefined();
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
        from: 1609419600,
        limit: 100,
        offset: 2,
        to: 1609506000,
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
    const data = { checkin: "checkin data" };
    await expect(
      doshii.loyalty.createCheckin(locationId, data)
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
      data,
    });
  });

  test("Should request for a checkin update", async () => {
    const checkinId = "aklsdhfj90834";
    const data = { checkin: "checkin data" };
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
    const checkinId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.deleteCheckin(locationId, checkinId)
    ).resolves.toBeDefined();
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
    const enquiryId = "aklsdhfj90834";
    const data = { enquiry: "enquiry response data" };
    await expect(
      doshii.loyalty.respondToEnquiry(locationId, enquiryId, data)
    ).resolves.toBeDefined();
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
    const activityId = "aklsdhfj90834";
    const data = { activity: "activity registration response data" };
    await expect(
      doshii.loyalty.respondToActivityRegisterRequest(
        locationId,
        activityId,
        data
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
      data,
    });
  });

  test("Should request for card enquiry requests", async () => {
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getCardEnquiryRequest(locationId, requestId)
    ).resolves.toBeDefined();
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
    const requestId = "aklsdhfj90834";
    const data = { enquiry: "Enquiry response update" };
    await expect(
      doshii.loyalty.respondToCardEnquiry(locationId, requestId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/enquiry/${requestId}`,
      data,
    });
  });

  test("Should request for card enquiry logs", async () => {
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getCardEnquiryLogs(locationId, requestId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/enquiry/${requestId}/logs`,
    });
  });

  test("Should request for card activation requests", async () => {
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
    const requestId = "aklsdhfj90834";
    const data = { activation: "activation response" };
    await expect(
      doshii.loyalty.respondToCardActivation(locationId, requestId, data)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "PUT",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/activation/${requestId}`,
      data,
    });
  });

  test("Should request for card activation logs", async () => {
    const requestId = "aklsdhfj90834";
    await expect(
      doshii.loyalty.getCardActivationLogs(locationId, requestId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/loyalty/cards/activation/${requestId}/logs`,
    });
  });
});
