import {
  Request,
  Response,
  NextFunction,
  request,
  response,
  json,
} from "express";
import Shifts from "../../model/stores/Shifts";
import shiftController from "../shift_Controller";
jest.mock("../../model/stores/Shifts");

describe("test query Shifts controller", () => {
  it("Should return a query", async () => {
    const tmr = new Date(Date.now() + 86400000);
    const req = {
      params: { dateID: tmr },
      cookies: jest.fn(request.cookies),
    } as unknown as Request;
    const res = {
      json: jest.fn(json),
      status: jest.fn(response.status),
    } as unknown as Response;
    (Shifts.aggregate as jest.Mock).mockReturnValue([
      {
        date: "2023-07-02",
        section: 2,
        waiter: {
          _id: "649e1951fb2d7aeb5e5b4a32",
        },
        shiftNumber: 0,
        shiftTables: [],
        __v: 0,
      },
      {
        date: "2023-07-02",
        section: 1,
        waiter: {
          _id: "649ae1951fad7aeb5e5b4a32",
        },
        shiftNumber: 0,
        shiftTables: [],
        __v: 0,
      },
    ]);

    await shiftController.queryShiftsDate(req, res, {} as NextFunction);

    expect(res.json).toHaveBeenCalledWith({
      message: "Succesfully Queried Shifts:2023-07-14",
      result: {
        0: [
          {
            date: "2023-07-02",
            section: 2,
            waiter: {
              _id: "649e1951fb2d7aeb5e5b4a32",
            },
            shiftNumber: 0,
            shiftTables: [],
            __v: 0,
          },
          {
            date: "2023-07-02",
            section: 1,
            waiter: {
              _id: "649ae1951fad7aeb5e5b4a32",
            },
            shiftNumber: 0,
            shiftTables: [],
            __v: 0,
          },
        ],
      },
    });
  });

  it("Not Date Format", async () => {
    const req = {
      params: { dateID: 1688342400000 },
      cookies: jest.fn(request.cookies),
    } as unknown as Request;
    const res = {
      json: jest.fn(json),
      status: jest.fn(response.status),
    } as unknown as Response;
    // (Shifts.find as jest.Mock).mockReturnValue

    await shiftController.queryShiftsDate(req, res, {} as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not Date Format, should be 2023-07-03T00:00:00.000Z",
    });
  });
});
