import Doshii from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ReferralRequest } from "../lib/referral";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleReferralResponse: ReferralRequest = {
    firstName: "James",
    lastName: "May",
    phone: "+61415123456",
    email: "info@therestaurant.org",
    venueName: "Joe's Burgers",
    partnerLocationId: "partnerLocationId123",
    doshiiLocationId: "doshiiLocationId123",
    doshiiOrganisationId: "doshiiOrganisationId123",
    address: {
        line1: "520 Bourke St",
        line2: "Level 1",
        city: "Melbourne",
        state: "VIC",
        country: "AU",
        postalCode: "3000",
        latitude: 34.4,
        longitude: 157.5
    }
};

describe("Referral", () => {
    let doshii: Doshii;
    const clientId = "some23Clients30edID";
    const clientSecret = "su234perDu[erse-898cret-09";
    let authSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        doshii = new Doshii(clientId, clientSecret, { sandbox: true });
        authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
    });

    test("Should create a referral", async () => {
        const requestSpy = jest
            .spyOn(axios, "request")
            .mockResolvedValue({ status: 200, data: [sampleReferralResponse] });

        await expect(doshii.referral.create(sampleReferralResponse)).resolves.toMatchObject([
            sampleReferralResponse
        ]);

        expect(requestSpy).toBeCalledWith({
            headers: {
                authorization: "Bearer signedJwt",
                "content-type": "application/json",
            },
            baseURL: "https://sandbox.doshii.co/partner/v3",
            method: "POST",
            url: "/referrals",
            data: sampleReferralResponse
        });

        expect(authSpy).toBeCalledTimes(1);
    });

    test("Should reject the promise if request fails", async () => {
        jest
            .spyOn(axios, "request")
            .mockRejectedValue({ status: 500, error: "failed" });

        await expect(doshii.referral.create(sampleReferralResponse)).rejects.toBeDefined();
    });
});
