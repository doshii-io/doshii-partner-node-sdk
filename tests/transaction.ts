import Doshii, { TransactionRequest, TransactionUpdate } from "../lib";
import nock from "nock";
import _ from "lodash";
import jwt from "jsonwebtoken";
import { sampleTransactionResponse } from "./sharedSamples";
jest.mock("jsonwebtoken");

describe("Transaction", () => {
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

  test("Should request for order transactions", async () => {
    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/orders/someOrderId/transactions`).reply(200, [sampleTransactionResponse]);

    await expect(
      doshii.transaction.getOrderTransactions(locationId, "someOrderId")
    ).resolves.toMatchObject([sampleTransactionResponse]);
    
    expect(jwt.sign).toBeCalledTimes(1);
  });

  test("Should request for a specific transaction", async () => {
    const transactionId = "transactionI34";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).get(`/partner/v3/transactions/${transactionId}`).reply(200, sampleTransactionResponse);

    await expect(
      doshii.transaction.getTransaction(locationId, transactionId)
    ).resolves.toMatchObject(sampleTransactionResponse);
  });

  test("Should request for a new transaction", async () => {
    const sampleCreateTransaction: TransactionRequest = {
      amount: 2500,
      reference: "123",
      invoice: "123",
      linkedTrxId: "123",
      method: "cash",
      tip: 500,
      trn: "100412786589",
      prepaid: true,
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
    };

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).post(`/partner/v3/orders/someOrderId/transactions`, _.matches(sampleCreateTransaction)).reply(200, sampleTransactionResponse);

    await expect(
      doshii.transaction.createTransaction(
        locationId,
        "someOrderId",
        sampleCreateTransaction
      )
    ).resolves.toMatchObject(sampleTransactionResponse);
  });

  test("Should request for a transaction update", async () => {
    const sampleUpdateTransaction: TransactionUpdate = {
      amount: 2500,
      version: "AJHBFjAKJFE3fnj33njj",
      status: "complete",
      reference: "123",
      invoice: "123",
      method: "cash",
      tip: 500,
      trn: "100412786589",
      prepaid: true,
      rejectionCode: "P1",
      rejectionReason: "Insufficient funds",
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
      verifyData: {
        requires: ["accountId"],
        accountId: "string",
        issueDate: "string",
        expiryDate: "string",
        authorisationCode: "string",
        imageUri: "string",
      },
    };

    const transactionId = "transactionI234";

    nock(SERVER_BASE_URL, {
      reqheaders: REQUEST_HEADERS,
    }).put(`/partner/v3/transactions/${transactionId}`, _.matches(sampleUpdateTransaction)).reply(200, sampleTransactionResponse);

    await expect(
      doshii.transaction.updateTransaction(
        locationId,
        transactionId,
        sampleUpdateTransaction
      )
    ).resolves.toMatchObject(sampleTransactionResponse);
  });
});
