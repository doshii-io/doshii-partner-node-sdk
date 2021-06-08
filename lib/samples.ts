export default {
  createOrderSample: {
    order: {
      externalOrderRef: "AQN-1234",
      manuallyProcessed: false,
      status: "pending",
      type: "pickup",
      notes: "Allergic to nuts",
      requiredAt: "2019-01-01T12:00:00.000Z",
      availableEta: "2019-01-01T12:00:00.000Z",
      items: [
        {
          posId: "123",
          name: "Toasted Sourdough Bread & Eggs",
          quantity: 1,
          description: "Just ye old classic",
          unitPrice: "1100",
          totalBeforeSurcounts: "1100",
          totalAfterSurcounts: "1100",
          tags: ["tag"],
          type: "bundle",
          includedItems: [
            {
              name: "Item name",
              posId: "123",
              quantity: 1,
              unitPrice: "1000",
              options: [
                {
                  posId: "123",
                  name: "Option name",
                  variants: [
                    {
                      posId: "123",
                      name: "Variant name",
                      price: "1000",
                    },
                  ],
                },
              ],
            },
          ],
          surcounts: [
            {
              posId: "123",
              name: "Item name",
              description: "Item description",
              amount: "1000",
              type: "absolute",
              value: "1000",
            },
          ],
          taxes: [
            {
              posId: "123",
              name: "State Tax",
              amount: "7.5",
              type: "percentage",
              taxType: "exclusive",
              value: "150",
            },
          ],
          options: [
            {
              posId: "123",
              name: "Option name",
              variants: [
                {
                  posId: "123",
                  name: "Variant name",
                  price: "1000",
                },
              ],
            },
          ],
        },
      ],
      surcounts: [
        {
          posId: "123",
          name: "Item name",
          description: "Item description",
          amount: "1000",
          type: "absolute",
          value: "1000",
        },
      ],
      taxes: [
        {
          posId: "123",
          name: "Government Tariff",
          amount: "300",
          type: "absolute",
          taxType: "exclusive",
          value: "300",
        },
      ],
      log: {
        employeeId: 123,
        employeePosRef: "123",
        employeeName: "John Doe",
        deviceRef: "123",
        deviceName: "MODEL A1",
        area: "Main dining hall",
      },
    },
    consumer: {
      name: "Tony",
      email: "user@test.com",
      phone: "+61415123456",
      address: {
        line1: "520 Bourke St",
        line2: "Level 1",
        city: "Melbourne",
        state: "VIC",
        postalCode: "3000",
        country: "AU",
        notes: "Beware of dog",
      },
    },
    transactions: [
      {
        amount: 2500,
        reference: "123",
        invoice: "123",
        linkedTrxId: "123",
        method: "cash",
        tip: 500,
        prepaid: true,
        surcounts: [
          {
            posId: "123",
            name: "Item name",
            description: "Item description",
            amount: "1000",
            type: "absolute",
            value: "1000",
          },
        ],
      },
    ],
    members: ["123-456-789", "456-789-123"],
  },
};
