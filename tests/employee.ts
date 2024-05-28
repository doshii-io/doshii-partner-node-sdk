import Doshii from "../lib";
import jwt from "jsonwebtoken";
import nock from "nock";
import _ from "lodash";

jest.mock("jsonwebtoken");

const sampleEmployeeResponse = {
  locationId: "6mGjdvV2",
  posEmployeeId: "Employee123",
  firstName: "James",
  lastName: "May",
  createdAt: "2019-01-01T12:00:00.000Z",
  updatedAt: "2019-01-01T12:00:00.000Z"
};

describe("Employee", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  const posEmployeeId = "Employee123";
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

  test("Should request for all employees", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/employees`).reply(200, [sampleEmployeeResponse]);

    await expect(doshii.employee.getAll(locationId)).resolves.toMatchObject([
      sampleEmployeeResponse
    ]);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific employee", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/employees/${posEmployeeId}`).reply(200, sampleEmployeeResponse);

    await expect(
      doshii.employee.getOne(locationId, posEmployeeId)
    ).resolves.toMatchObject(sampleEmployeeResponse);

    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should reject the promise if request fails", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(() => true).reply(500);

    await expect(doshii.employee.getOne(locationId, posEmployeeId)).rejects.toBeDefined();
    await expect(doshii.employee.getAll(locationId)).rejects.toBeDefined();
  });
});
