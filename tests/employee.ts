import Doshii from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
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
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, { sandbox: true });
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for all employees", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: [sampleEmployeeResponse] });

    await expect(doshii.employee.getAll(locationId)).resolves.toMatchObject([
      sampleEmployeeResponse
    ]);

    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      baseURL: "https://sandbox.doshii.co/partner/v3",
      method: "GET",
      url: "/employees",
    });

    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should request for a specific employee", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleEmployeeResponse });

    await expect(
      doshii.employee.getOne(locationId, posEmployeeId)
    ).resolves.toMatchObject(sampleEmployeeResponse);

    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/employees/${posEmployeeId}`,
    });

    expect(authSpy).toBeCalledTimes(1);
  });

  test("Should reject the promise if request fails", async () => {
    jest
      .spyOn(axios, "request")
      .mockRejectedValue({ status: 500, error: "failed" });

    await expect(doshii.employee.getOne(locationId, posEmployeeId)).rejects.toBeDefined();
    await expect(doshii.employee.getAll(locationId)).rejects.toBeDefined();
  });
});
