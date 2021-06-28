import Doshii from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
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
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all rejection codes", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleResponse] });
    await expect(doshii.getRejectionCodes()).resolves.toMatchObject([
      sampleResponse,
    ]);
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/rejection_codes",
    });
    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific rejection code", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleResponse });
    await expect(doshii.getRejectionCodes("01")).resolves.toMatchObject(
      sampleResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: "/rejection_codes/01",
    });
    expect(authSpy).toBeCalledTimes(1);
  });
});
