import Booking from "../lib/booking";

describe("Booking", () => {
  let requestMaker: any;
  let booking: Booking;
  const locationId = "some0Location5Id9";
  beforeEach(() => {
    jest.clearAllMocks();
    requestMaker = jest.fn().mockResolvedValue({ staus: 200 });
    booking = new Booking(requestMaker);
  });
  test("Should create a booking retrieval request", async () => {
    await expect(booking.get(locationId)).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      method: "GET",
      url: "/bookings",
    });
    await expect(
      booking.get(locationId, "some0Booking234Id")
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      method: "GET",
      url: "/bookings/some0Booking234Id",
    });
  });

  test("Should create a bookings logs retrieval request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(booking.getLogs(locationId, bookingId)).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      method: "GET",
      url: `/bookings/${bookingId}/logs`,
    });
  });

  test("Should create a preorder retrieval request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      booking.getPreorders(locationId, bookingId)
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      method: "GET",
      url: `/bookings/${bookingId}/preorders`,
    });
  });

  test("Should create a new booking request", async () => {
    await expect(
      booking.createBooking(locationId, { orders: "test booking" })
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      data: { orders: "test booking" },
      method: "POST",
      url: `/bookings`,
    });
  });

  test("Should create a booking updation request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      booking.updateBooking(locationId, bookingId, { orders: "update booking" })
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      data: { orders: "update booking" },
      method: "PUT",
      url: `/bookings/${bookingId}`,
    });
  });

  test("Should create a booking deletion request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      booking.deleteBooking(locationId, bookingId)
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      method: "DELETE",
      url: `/bookings/${bookingId}`,
    });
  });

  test("Should create a new checkin request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      booking.createCheckin(locationId, bookingId, {
        checkin: "create checkin",
      })
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      data: { checkin: "create checkin" },
      method: "POST",
      url: `/bookings/${bookingId}/checkin`,
    });
  });

  test("Should create a new preorder request", async () => {
    const bookingId = "some0Booking5Id345";
    await expect(
      booking.createPreorder(locationId, bookingId, {
        preorder: "create preorder",
      })
    ).resolves.toBeDefined();
    expect(requestMaker).toBeCalledWith({
      headers: {
        "doshii-location-id": locationId,
      },
      data: { preorder: "create preorder" },
      method: "POST",
      url: `/bookings/${bookingId}/preorder`,
    });
  });
});
