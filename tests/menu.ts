import Doshii from "../lib";
import axios from "axios";
import jwt from "jsonwebtoken";

jest.mock("axios");
jest.mock("jsonwebtoken");

const sampleMenuResponse = {
  description: "Bob's classic breakfast menu",
  imageUri: "https://some.where.else/member/1653/4623.png",
  surcounts: [
    {
      posId: "10_percent_discount",
      name: "10% Discount",
      amount: -10,
      type: "percentage",
    },
  ],
  options: [
    {
      posId: "egg_cook_type",
      name: "How would you like the eggs cooked?",
      min: 1,
      max: 10,
      variants: [
        {
          posId: "123",
          name: "Variant name",
          price: "1000",
          alternateNames: {
            default: {
              display: "<human readable>",
              kitchen: "<for the kitchen>",
              default: "<for the receipt>",
            },
            "en-AAA": {
              display: "<other language>",
              kitchen: "<other language>",
              default: "<other language>",
            },
          },
        },
      ],
      alternateNames: {
        default: {
          display: "<human readable>",
          kitchen: "<for the kitchen>",
          default: "<for the receipt>",
        },
        "en-AAA": {
          display: "<other language>",
          kitchen: "<other language>",
          default: "<other language>",
        },
      },
    },
  ],
  products: [
    {
      posId: "eggs12",
      name: "Toasted Sourdough & Eggs",
      type: "single",
      availability: "available",
      productIds: {
        "gtin-8": "12345678",
        "gtin-12": "123456789012",
        "gtin-13": "1234567890123",
        "gtin-14": "12345678901234",
        sku: "sku123",
        plu: "1234",
        barcodes: ["112233445566778899"],
      },
      description: "Just ye old classic",
      unitPrice: 1100,
      tags: ["Breakfast", "Lunch"],
      dietary: ["gluten-free", "contains-nuts"],
      menuDir: ["string"],
      includedItems: [
        {
          posId: "123",
          productIds: {
            "gtin-8": "12345678",
            "gtin-12": "123456789012",
            "gtin-13": "1234567890123",
            "gtin-14": "12345678901234",
            sku: "sku123",
            plu: "1234",
            barcodes: ["112233445566778899"],
          },
          name: "Item name",
          quantity: 1,
          unitPrice: 1000,
          options: [
            {
              posId: "egg_cook_type",
              name: "How would you like the eggs cooked?",
              min: 1,
              max: 10,
              variants: [
                {
                  posId: "123",
                  name: "Variant name",
                  price: "1000",
                  alternateNames: {
                    default: {
                      display: "<human readable>",
                      kitchen: "<for the kitchen>",
                      default: "<for the receipt>",
                    },
                    "en-AAA": {
                      display: "<other language>",
                      kitchen: "<other language>",
                      default: "<other language>",
                    },
                  },
                },
              ],
              alternateNames: {
                default: {
                  display: "<human readable>",
                  kitchen: "<for the kitchen>",
                  default: "<for the receipt>",
                },
                "en-AAA": {
                  display: "<other language>",
                  kitchen: "<other language>",
                  default: "<other language>",
                },
              },
            },
          ],
          alternateNames: {
            default: {
              display: "<human readable>",
              kitchen: "<for the kitchen>",
              default: "<for the receipt>",
            },
            "en-AAA": {
              display: "<other language>",
              kitchen: "<other language>",
              default: "<other language>",
            },
          },
        },
      ],
      bundledItems: [
        {
          posId: "123",
          name: "Choose your burger",
          min: 1,
          max: 10,
          includedItems: [
            {
              posId: "123",
              productIds: {
                "gtin-8": "12345678",
                "gtin-12": "123456789012",
                "gtin-13": "1234567890123",
                "gtin-14": "12345678901234",
                sku: "sku123",
                plu: "1234",
                barcodes: ["112233445566778899"],
              },
              name: "Item name",
              quantity: 1,
              unitPrice: 1000,
              options: [
                {
                  posId: "egg_cook_type",
                  name: "How would you like the eggs cooked?",
                  min: 1,
                  max: 10,
                  variants: [
                    {
                      posId: "123",
                      name: "Variant name",
                      price: "1000",
                      alternateNames: {
                        default: {
                          display: "<human readable>",
                          kitchen: "<for the kitchen>",
                          default: "<for the receipt>",
                        },
                        "en-AAA": {
                          display: "<other language>",
                          kitchen: "<other language>",
                          default: "<other language>",
                        },
                      },
                    },
                  ],
                  alternateNames: {
                    default: {
                      display: "<human readable>",
                      kitchen: "<for the kitchen>",
                      default: "<for the receipt>",
                    },
                    "en-AAA": {
                      display: "<other language>",
                      kitchen: "<other language>",
                      default: "<other language>",
                    },
                  },
                },
              ],
              alternateNames: {
                default: {
                  display: "<human readable>",
                  kitchen: "<for the kitchen>",
                  default: "<for the receipt>",
                },
                "en-AAA": {
                  display: "<other language>",
                  kitchen: "<other language>",
                  default: "<other language>",
                },
              },
            },
          ],
        },
      ],
      options: [
        {
          posId: "egg_cook_type",
          name: "How would you like the eggs cooked?",
          min: 1,
          max: 10,
          variants: [
            {
              posId: "123",
              name: "Variant name",
              price: "1000",
              alternateNames: {
                default: {
                  display: "<human readable>",
                  kitchen: "<for the kitchen>",
                  default: "<for the receipt>",
                },
                "en-AAA": {
                  display: "<other language>",
                  kitchen: "<other language>",
                  default: "<other language>",
                },
              },
            },
          ],
          alternateNames: {
            default: {
              display: "<human readable>",
              kitchen: "<for the kitchen>",
              default: "<for the receipt>",
            },
            "en-AAA": {
              display: "<other language>",
              kitchen: "<other language>",
              default: "<other language>",
            },
          },
        },
      ],
      surcounts: [
        {
          posId: "10_percent_discount",
          name: "10% Discount",
          amount: -10,
          type: "percentage",
        },
      ],
      alternateNames: {
        default: {
          display: "<human readable>",
          kitchen: "<for the kitchen>",
          default: "<for the receipt>",
        },
        "en-AAA": {
          display: "<other language>",
          kitchen: "<other language>",
          default: "<other language>",
        },
      },
      imageUri: "https://some.where.else/member/1653/4622.png",
    },
  ],
  updatedAt: "2019-01-01T12:00:00.000Z",
  createdAt: "2019-01-01T12:00:00.000Z",
  version: "iwgjr2NJ014",
  uri: "https://sandbox.doshii.co/partner/v3/locations/2xwe34c/menu",
};

const sampleMenuProductResponse = {
  posId: "eggs12",
  name: "Toasted Sourdough & Eggs",
  type: "single",
  availability: "available",
  productIds: {
    "gtin-8": "12345678",
    "gtin-12": "123456789012",
    "gtin-13": "1234567890123",
    "gtin-14": "12345678901234",
    sku: "sku123",
    plu: "1234",
    barcodes: ["112233445566778899"],
  },
  description: "Just ye old classic",
  unitPrice: 1100,
  tags: ["Breakfast", "Lunch"],
  dietary: ["gluten-free", "contains-nuts"],
  menuDir: ["string"],
  includedItems: [
    {
      posId: "123",
      productIds: {
        "gtin-8": "12345678",
        "gtin-12": "123456789012",
        "gtin-13": "1234567890123",
        "gtin-14": "12345678901234",
        sku: "sku123",
        plu: "1234",
        barcodes: ["112233445566778899"],
      },
      name: "Item name",
      quantity: 1,
      unitPrice: 1000,
      options: [
        {
          posId: "egg_cook_type",
          name: "How would you like the eggs cooked?",
          min: 1,
          max: 10,
          variants: [
            {
              posId: "123",
              name: "Variant name",
              price: "1000",
              alternateNames: {
                default: {
                  display: "<human readable>",
                  kitchen: "<for the kitchen>",
                  default: "<for the receipt>",
                },
                "en-AAA": {
                  display: "<other language>",
                  kitchen: "<other language>",
                  default: "<other language>",
                },
              },
            },
          ],
          alternateNames: {
            default: {
              display: "<human readable>",
              kitchen: "<for the kitchen>",
              default: "<for the receipt>",
            },
            "en-AAA": {
              display: "<other language>",
              kitchen: "<other language>",
              default: "<other language>",
            },
          },
        },
      ],
      alternateNames: {
        default: {
          display: "<human readable>",
          kitchen: "<for the kitchen>",
          default: "<for the receipt>",
        },
        "en-AAA": {
          display: "<other language>",
          kitchen: "<other language>",
          default: "<other language>",
        },
      },
    },
  ],
  bundledItems: [
    {
      posId: "123",
      name: "Choose your burger",
      min: 1,
      max: 10,
      includedItems: [
        {
          posId: "123",
          productIds: {
            "gtin-8": "12345678",
            "gtin-12": "123456789012",
            "gtin-13": "1234567890123",
            "gtin-14": "12345678901234",
            sku: "sku123",
            plu: "1234",
            barcodes: ["112233445566778899"],
          },
          name: "Item name",
          quantity: 1,
          unitPrice: 1000,
          options: [
            {
              posId: "egg_cook_type",
              name: "How would you like the eggs cooked?",
              min: 1,
              max: 10,
              variants: [
                {
                  posId: "123",
                  name: "Variant name",
                  price: "1000",
                  alternateNames: {
                    default: {
                      display: "<human readable>",
                      kitchen: "<for the kitchen>",
                      default: "<for the receipt>",
                    },
                    "en-AAA": {
                      display: "<other language>",
                      kitchen: "<other language>",
                      default: "<other language>",
                    },
                  },
                },
              ],
              alternateNames: {
                default: {
                  display: "<human readable>",
                  kitchen: "<for the kitchen>",
                  default: "<for the receipt>",
                },
                "en-AAA": {
                  display: "<other language>",
                  kitchen: "<other language>",
                  default: "<other language>",
                },
              },
            },
          ],
          alternateNames: {
            default: {
              display: "<human readable>",
              kitchen: "<for the kitchen>",
              default: "<for the receipt>",
            },
            "en-AAA": {
              display: "<other language>",
              kitchen: "<other language>",
              default: "<other language>",
            },
          },
        },
      ],
    },
  ],
  options: [
    {
      posId: "egg_cook_type",
      name: "How would you like the eggs cooked?",
      min: 1,
      max: 10,
      variants: [
        {
          posId: "123",
          name: "Variant name",
          price: "1000",
          alternateNames: {
            default: {
              display: "<human readable>",
              kitchen: "<for the kitchen>",
              default: "<for the receipt>",
            },
            "en-AAA": {
              display: "<other language>",
              kitchen: "<other language>",
              default: "<other language>",
            },
          },
        },
      ],
      alternateNames: {
        default: {
          display: "<human readable>",
          kitchen: "<for the kitchen>",
          default: "<for the receipt>",
        },
        "en-AAA": {
          display: "<other language>",
          kitchen: "<other language>",
          default: "<other language>",
        },
      },
    },
  ],
  surcounts: [
    {
      posId: "10_percent_discount",
      name: "10% Discount",
      amount: -10,
      type: "percentage",
    },
  ],
  alternateNames: {
    default: {
      display: "<human readable>",
      kitchen: "<for the kitchen>",
      default: "<for the receipt>",
    },
    "en-AAA": {
      display: "<other language>",
      kitchen: "<other language>",
      default: "<other language>",
    },
  },
  imageUri: "https://some.where.else/member/1653/4622.png",
};

const sampleMenuOption = {
  posId: "egg_cook_type",
  name: "How would you like the eggs cooked?",
  min: 1,
  max: 10,
  variants: [
    {
      posId: "123",
      name: "Variant name",
      price: "1000",
      alternateNames: {
        default: {
          display: "<human readable>",
          kitchen: "<for the kitchen>",
          default: "<for the receipt>",
        },
        "en-AAA": {
          display: "<other language>",
          kitchen: "<other language>",
          default: "<other language>",
        },
      },
    },
  ],
  alternateNames: {
    default: {
      display: "<human readable>",
      kitchen: "<for the kitchen>",
      default: "<for the receipt>",
    },
    "en-AAA": {
      display: "<other language>",
      kitchen: "<other language>",
      default: "<other language>",
    },
  },
};

describe("Location", () => {
  let doshii: Doshii;
  const locationId = "some0Location5Id9";
  const clientId = "some23Clients30edID";
  const clientSecret = "su234perDu[erse-898cret-09";
  let authSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    doshii = new Doshii(clientId, clientSecret, "", true);
    authSpy = jest.spyOn(jwt, "sign").mockImplementation(() => "signedJwt");
  });

  test("Should request for menu with or without options", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleMenuResponse });
    await expect(doshii.menu.get(locationId)).resolves.toMatchObject(
      sampleMenuResponse
    );
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu`,
    });

    await expect(
      doshii.menu.get(locationId, {
        lastVersion: "v2",
        filtered: true,
      })
    ).resolves.toMatchObject(sampleMenuResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu`,
      params: {
        lastVersion: "v2",
        filtered: true,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for products with or without options", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleMenuProductResponse });
    const posId = "345sd";
    await expect(
      doshii.menu.getProduct(locationId, posId)
    ).resolves.toMatchObject(sampleMenuProductResponse);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/products/${posId}`,
    });

    await expect(
      doshii.menu.getProduct(locationId, posId, {
        filtered: false,
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
      url: `/locations/${locationId}/menu/products/${posId}`,
      params: {
        filtered: false,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for products options with or without filters", async () => {
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: sampleMenuOption });
    const posId = "345sd";
    await expect(
      doshii.menu.getProductOptions(locationId, posId)
    ).resolves.toMatchObject(sampleMenuOption);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/options/${posId}`,
    });

    await expect(
      doshii.menu.getProductOptions(locationId, posId, {
        filtered: false,
      })
    ).resolves.toMatchObject(sampleMenuOption);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/options/${posId}`,
      params: {
        filtered: false,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });

  test("Should request for surcounts with or without filters", async () => {
    const response = {
      posId: "10_percent_discount",
      name: "10% Discount",
      amount: -10,
      type: "percentage",
    };
    const requestSpy = jest
      .spyOn(axios, "request")
      .mockResolvedValue({ status: 200, data: response });
    const posId = "345sd";
    await expect(
      doshii.menu.getSurcounts(locationId, posId)
    ).resolves.toMatchObject(response);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/surcounts/${posId}`,
    });

    await expect(
      doshii.menu.getSurcounts(locationId, posId, {
        filtered: false,
      })
    ).resolves.toMatchObject(response);
    expect(requestSpy).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
        authorization: "Bearer signedJwt",
        "content-type": "application/json",
      },
      method: "GET",
      baseURL: "https://sandbox.doshii.co/partner/v3",
      url: `/locations/${locationId}/menu/surcounts/${posId}`,
      params: {
        filtered: false,
      },
    });

    expect(authSpy).toBeCalledTimes(2);
  });
});
