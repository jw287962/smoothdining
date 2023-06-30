import { Request, Response, NextFunction } from "express";
import Party from "../model/stores/Party";
import { helperFunctions } from "./helper_Controller";
import { body, header } from "express-validator";

declare module "express" {
  interface Request {
    headers: {
      storeid?: string;
    };
  }
}

const partyController = {
  queryAllPartyToday: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const allPartyToday = await Party.find({
      reservationDate: new Date().toDateString(),
    });

    res.json({
      message: "query shifts of party of today",
      todayParties: allPartyToday,
    });
  },
  createNewParty: async (req: Request, res: Response, next: NextFunction) => {
    const party = req.body;
    const head = req.headers;
    try {
      const newParty = new Party({
        name: party.name,
        partySize: party.partySize,
        phoneNumber: party.phoneNumber,
        reservationDate: party.reservationDate,
        timeData: {
          checkInTime: party.checkInTime,
          startDining: {
            time: null,
            isEntreeOnTable: null,
          },
          finishedTime: null,
          waitingTime: null,
        },
        status: "Active",
        store: head.storeid,
      });

      const result = Party.create(newParty);
      res.json({ message: "new Party Created", result: result });
    } catch (e) {
      res.status(400).json({ error: e, message: "Failed to create Party" });
    }
  },
  setPartyCheckIn: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {},
  setPartyDining: async (req: Request, res: Response, next: NextFunction) => {},
  setPartyStatus: async (req: Request, res: Response, next: NextFunction) => {},

  validation: {
    validateCreatePartyData:
      (body("name").notEmpty().escape().isString(),
      body("partySize").notEmpty().isNumeric(),
      body("reservationDate").isDate().notEmpty(),
      body("checkInTime").isDate(),
      body("status").notEmpty(),
      header("storeID").escape().notEmpty(),
      body("phoneNumber").isMobilePhone,
      helperFunctions.expressValidationMiddleware),
  },
};

export default partyController;
