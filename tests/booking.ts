import Doshii, { BookingStatus } from "../lib";
import jwt from "jsonwebtoken";
import nock from "nock";
import _ from "lodash";
import {
  sampleBookingResponses,
  sampleBookingResponse,
  sampleOrderResponses,
  sampleOrderResponse,
  sampleCheckinRequest,
  sampleCheckinResponse,
  sampleOrderRequest,
} from "./sharedSamples";

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

  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
    "doshii-location-id": locationId,
    authorization: "Bearer signedJwt",
    "content-type": "application/json"
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

  test("Should request for all bookings", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get('/partner/v3/bookings').reply(200, sampleBookingResponses);

    await expect(doshii.booking.getAll(locationId)).resolves.toMatchObject(
      sampleBookingResponses
    );

    // with filters
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get('/partner/v3/bookings')
    .query({
          from: 1609459200,
          to: 1609545600,
          offset: 4,
          limit: 3,
        })
    .reply(200, sampleBookingResponses);

    const filters = {
      from: new Date(Date.UTC(2021, 0, 1)),
      to: new Date(Date.UTC(2021, 0, 2)),
      offset: 4,
      limit: 3,
    };

    await expect(
      doshii.booking.getAll(locationId, filters)
    ).resolves.toMatchObject(sampleBookingResponses);

    expect(jwt.sign).toHaveBeenCalledTimes(2);
  });

  test("Should request for a specific booking", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get('/partner/v3/bookings/some0Booking234Id').reply(200, sampleBookingResponse);

    await expect(
      doshii.booking.getOne(locationId, "some0Booking234Id")
    ).resolves.toMatchObject(sampleBookingResponse);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should reject the promise if request fails", async () => {
    nock(SERVER_BASE_URL).get(() => true).reply(500);

    await expect(
      doshii.booking.getAll(locationId)
    ).rejects.toBeDefined();

    await expect(
      doshii.booking.getOne(locationId, "some0Booking234Id")
    ).rejects.toBeDefined();
  });

  test("Should request for preorders without filters", async () => {
    const bookingId = "some0Booking5Id345";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/bookings/${bookingId}/preorders`).reply(200, sampleOrderResponses);

    await expect(
      doshii.booking.getPreorders(locationId, bookingId)
    ).resolves.toMatchObject(sampleOrderResponses);
  });

  test("Should request for preorders with filters", async () => {
    const bookingId = "some0Booking5Id345";

    const filters = {
      offset: 3,
      limit: 4,
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/bookings/${bookingId}/preorders`)
    .query({
      offset: 3,
      limit: 4,
    })
    .reply(200, sampleOrderResponses);

    await expect(
      doshii.booking.getPreorders(locationId, bookingId, filters)
    ).resolves.toMatchObject(sampleOrderResponses);
  });

  test("Should request for a new booking creation", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).post(`/partner/v3/bookings`, _.matches(sampleBookingRequest)).reply(200, sampleBookingResponse);

    await expect(
      doshii.booking.createBooking(locationId, sampleBookingRequest)
    ).resolves.toMatchObject(sampleBookingResponse);
  });

  test("Should create a booking update request", async () => {
    const bookingId = "some0Booking5Id345";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).put(`/partner/v3/bookings/${bookingId}`, _.matches(sampleBookingRequest)).reply(200, sampleBookingResponse);

    await expect(
      doshii.booking.updateBooking(locationId, bookingId, sampleBookingRequest)
    ).resolves.toMatchObject(sampleBookingResponse);
  });

  test("Should create a booking deletion request", async () => {
    const bookingId = "some0Booking5Id345";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).delete(`/partner/v3/bookings/${bookingId}`).reply(200, { message: "Booking deleted" });

    await expect(
      doshii.booking.deleteBooking(locationId, bookingId)
    ).resolves.toMatchObject({ message: "Booking deleted" });
  });

  test("Should create a new checkin request", async () => {
    const bookingId = "some0Booking5Id345";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).post(`/partner/v3/bookings/${bookingId}/checkin`, _.matches(sampleCheckinRequest)).reply(200, sampleCheckinResponse);

    await expect(
      doshii.booking.createCheckin(locationId, bookingId, sampleCheckinRequest)
    ).resolves.toMatchObject(sampleCheckinResponse);
  });

  test("Should create a new preorder request", async () => {
    const bookingId = "some0Booking5Id345";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).post(`/partner/v3/bookings/${bookingId}/preorder`, _.matches(sampleOrderRequest)).reply(200, sampleOrderResponse);

    await expect(
      doshii.booking.createPreorder(locationId, bookingId, sampleOrderRequest)
    ).resolves.toMatchObject(sampleOrderResponse);
  });
});
