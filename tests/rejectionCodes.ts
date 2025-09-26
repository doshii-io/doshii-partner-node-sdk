import Doshii from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

const sampleResponse = {
  code: "O1",
  description: "Item unitPrice incorrect",
  entity: "orders",
};

describe("Rejection codes", () => {
  let doshii: Doshii;
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  const SERVER_BASE_URL = `https://sandbox.doshii.co`;
  const REQUEST_HEADERS = {
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

  test("Should request for all rejection codes", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/rejection_codes`).reply(200, [sampleResponse]);

    await expect(doshii.getRejectionCodes()).resolves.toMatchObject([
      sampleResponse,
    ]);

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });

  test("Should request for a specific rejection code", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/rejection_codes/01`).reply(200, sampleResponse);

    await expect(doshii.getRejectionCodes("01")).resolves.toMatchObject(
      sampleResponse
    );

    expect(jwt.sign).toHaveBeenCalledTimes(1);
  });
});
