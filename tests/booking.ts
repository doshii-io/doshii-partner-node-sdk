import Doshii from "../lib/doshii";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

describe("Booking", () => {
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

  test("Should request for bookings", async () => {
    await expect(doshii.booking.get(locationId)).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/bookings",
    });
    await expect(
      doshii.booking.get(locationId, "some0Booking234Id")
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/bookings/some0Booking234Id",
    });
    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should reject the promise if request fails", async () => {
    jest
      .spyOn(axios, "request")
      .mockRejectedValue({ status: 500, error: "failed" });
    await expect(
      doshii.booking.get(locationId, "some0Booking234Id")
    ).rejects.toBeDefined();
  });

  test("Should request for booking logs", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.getLogs(locationId, bookingId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/bookings/${bookingId}/logs`,
    });
  });

  test("Should request for preorders", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.getPreorders(locationId, bookingId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/bookings/${bookingId}/preorders`,
    });
  });

  test("Should request for a new booking creation", async () => {
    await expect(
      doshii.booking.createBooking(locationId, { orders: "test booking" })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: { orders: "test booking" },
      method: "POST",
      url: `/bookings`,
    });
  });

  test("Should create a booking updation request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.updateBooking(locationId, bookingId, {
        orders: "update booking",
      })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: { orders: "update booking" },
      method: "PUT",
      url: `/bookings/${bookingId}`,
    });
  });

  test("Should create a booking deletion request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.deleteBooking(locationId, bookingId)
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "DELETE",
      url: `/bookings/${bookingId}`,
    });
  });

  test("Should create a new checkin request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.createCheckin(locationId, bookingId, {
        checkin: "create checkin",
      })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: { checkin: "create checkin" },
      method: "POST",
      url: `/bookings/${bookingId}/checkin`,
    });
  });

  test("Should create a new preorder request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.createPreorder(locationId, bookingId, {
        preorder: "create preorder",
      })
    ).resolves.toBeDefined();
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: { preorder: "create preorder" },
      method: "POST",
      url: `/bookings/${bookingId}/preorder`,
    });
  });
});
