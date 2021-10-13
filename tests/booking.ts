import Doshii, { BookingStatus } from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";
import {
  sampleBookingResponses,
  sampleBookingResponse,
  sampleOrderResponses,
  sampleOrderResponse,
  sampleCheckinRequest,
  sampleCheckinResponse,
  sampleOrderRequest,
} from "./sharedSamples";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleBookingRequest = {
  status: BookingStatus.PENDING,
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
  version: "pD7Jv2Vk93sq3levVxrWuKaEjxzApphzRWGGajeq",
};

describe("Booking", () => {
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

  test("Should request for all bookings", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleBookingResponses });
    await expect(doshii.booking.getAll(locationId)).resolves.toMatchObject(
      sampleBookingResponses
    );
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
    // with filters
    const filters = {
      from: new Date(Date.UTC(2021, 0, 1)),
      to: new Date(Date.UTC(2021, 0, 2)),
      offset: 4,
      limit: 3,
    };
    await expect(
      doshii.booking.getAll(locationId, filters)
    ).resolves.toMatchObject(sampleBookingResponses);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/bookings",
      params: {
        from: 1609459200,
        to: 1609545600,
        offset: 4,
        limit: 3,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for a specific booking", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleBookingResponse });
    await expect(
      doshii.booking.get(locationId, "some0Booking234Id")
    ).resolves.toMatchObject(sampleBookingResponse);
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
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should reject the promise if request fails", async () => {
    jest
      .spyOn(axios, "request")
      .mockRejectedValue({ status: 500, error: "failed" });
    await expect(
      doshii.booking.get(locationId, "some0Booking234Id")
    ).rejects.toBeDefined();
  });

  test("Should request for preorders with and without filters", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponses });
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.getPreorders(locationId, bookingId)
    ).resolves.toMatchObject(sampleOrderResponses);
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

    // with filters
    const filters = {
      offset: 3,
      limit: 4,
    };
    await expect(
      doshii.booking.getPreorders(locationId, bookingId, filters)
    ).resolves.toMatchObject(sampleOrderResponses);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/bookings/${bookingId}/preorders`,
      params: filters,
    });
  });

  test("Should request for a new booking creation", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleBookingResponse });
    await expect(
      doshii.booking.createBooking(locationId, sampleBookingRequest)
    ).resolves.toMatchObject(sampleBookingResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "POST",
      url: `/bookings`,
      data: sampleBookingRequest,
    });
  });

  test("Should create a booking updation request", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleBookingResponse });
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.updateBooking(locationId, bookingId, sampleBookingRequest)
    ).resolves.toMatchObject(sampleBookingResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: sampleBookingRequest,
      method: "PUT",
      url: `/bookings/${bookingId}`,
    });
  });

  test("Should create a booking deletion request", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: { message: "Booking deleted" } });
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.deleteBooking(locationId, bookingId)
    ).resolves.toMatchObject({ message: "Booking deleted" });
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
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleCheckinResponse });
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.createCheckin(locationId, bookingId, sampleCheckinRequest)
    ).resolves.toMatchObject(sampleCheckinResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: sampleCheckinRequest,
      method: "POST",
      url: `/bookings/${bookingId}/checkin`,
    });
  });

  test("Should create a new preorder request", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleOrderResponse });
    const bookingId = "some0Booking5Id345";
    await expect(
      doshii.booking.createPreorder(locationId, bookingId, sampleOrderRequest)
    ).resolves.toMatchObject(sampleOrderResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      data: sampleOrderRequest,
      method: "POST",
      url: `/bookings/${bookingId}/preorder`,
    });
  });
});
