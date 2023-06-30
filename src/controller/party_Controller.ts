import { Request, Response, NextFunction } from "express";
import Party from "../model/stores/Party";
import { helperFunctions } from "./helper_Controller";
import { body, cookie } from "express-validator";
declare module "express" {
  interface Request {
    headers: {
      storeID?: string;
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
    if (party.reservationDate === undefined) {
      party.reservationDate = null;
      party.checkInTime = new Date().toString();
    }
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
        store: req.cookies.storeID,
      });

      const result = await Party.create(newParty);
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
    validateCreatePartyData: [
      body("name").notEmpty().escape().isString(),
      body("partySize").notEmpty().isNumeric(),
      body("reservationDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
        .withMessage("format: new Date() objects | YYYY-MM-DDTHH:mm:ss.SSSZ"),
      body("checkInTime").optional().escape(),
      body("status").optional(),
      body("phoneNumber").isMobilePhone(["en-US"], { strictMode: false }),
      cookie("storeID").escape().notEmpty(),
      helperFunctions.expressValidationMiddleware,
    ],
  },
};
// THH:mm:ss.SSSZ
// .matches(
//   /^((\+1|1)?( |-)?)?(\(([2-9])(?:\d(?!\5)\d|(?!\5)\d\d)\)|([2-9])(?:\d(?!\6)\d|(?!\6)\d\d))( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/
// ),

export default partyController;
