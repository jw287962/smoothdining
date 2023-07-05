import { Request, Response, NextFunction, response, json } from "express";
import Party, { partyInterface } from "../../model/stores/Party";
import partyController from "../party_Controller";
import { ObjectId } from "mongodb";

// import { Request as request, Response as response } from "supertest";

jest.mock("../../model/stores/Party");

const partyData: partyInterface = {
  name: "Test Party",
  partySize: 5,
  phoneNumber: "1234567890",
  reservationDate: new Date(),
  reservationDateTime: new Date(),
  timeData: {
    checkInTime: new Date(),
    startDining: {
      time: new Date(),
      isEntreeOnTable: false,
    },
    finishedTime: undefined,
    waitingTime: undefined,
  },
  status: "Active",
  store: new ObjectId("649e74a70ade9c43e91ae591"),
};
const req = {
  body: { party: partyData },
  cookies: { storeID: new ObjectId("649e74a70ade9c43e91ae591") },
} as unknown as Request;

describe("createNewParty", () => {
  it("should create a new party", async () => {
    const res = {
      json: jest.fn(json),
      status: jest.fn(response.status),
    } as unknown as Response;
    // console.log("Party:", Party);

    const partyMockImplementation = jest.fn().mockResolvedValue(partyData);

    jest.spyOn(Party, "create").mockImplementation(partyMockImplementation);
    // Party.create.mockImplementation(partyMockImplementation);

    await partyController.createNewParty(req, res, {} as NextFunction);
    expect(res.json).toHaveBeenCalledWith({
      message: "new Party Created",
      result: partyData,
    });
  });

  it("phoneNumber not correct format. Send status and error", async () => {
    partyData.phoneNumber = "123";
    const res = {
      json: jest.fn(json),
      status: jest.fn(response.status),
    } as unknown as Response;
    // Mock the Party.create method to throw an error
    console.log("Party:", Party);

    const createPartyMock = jest
      .fn()
      .mockRejectedValue(new Error("Party creation failed"));
    jest.spyOn(Party, "create").mockImplementation(createPartyMock);

    // Party.create.mockRejectedValue(
    //   new Error("Party creation failed")
    // );

    // Call the createNewParty function
    await partyController.createNewParty(req, res, {} as NextFunction);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: expect.any(Error),
      message: "Failed to create Party",
    });
  });

  it("empty", async () => {});
});
