import { Request, Response, NextFunction } from "express";
import Party from "../model/stores/Party";
import { dateRegex, helperFunctions } from "./helper_Controller";
import { body, cookie } from "express-validator";
// declare module "express" {
//   interface Request {
//     headers: {
//       storeID?: string;
//     };
//   }
// }

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

  setPartyTimeData: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.partyID;
    // const timeData = {
    //   checkInTime: req.body.checkInTime,
    //   startDining: {
    //     time: req.body.startDining,
    //     isEntreeOnTable: req.body.isEntreeOnTable,
    //   },
    //   finishedTime: req.body.finishedTime,
    //   waitingTime: req.body.waitingTime,
    // };
    const timeData = req.body;
    try {
      const timeDataFilter = Object.fromEntries(
        Object.entries(timeData).filter(([key, value]) => value != undefined)
      );

      const result = Party.updateOne({ _id: id }, { $set: timeDataFilter });
      res.json({ result: result, message: "Party Time Updated Successfully" });
    } catch (e) {
      res.status(400).json({ message: "Failed to Update Party Time Data" });
    }
  },
  setPartyStatus: async (req: Request, res: Response, next: NextFunction) => {
    const store = req.cookies.storeID;
    const id = req.params.partyID;
    const status = req.body.status;

    try {
      const result = Party.updateOne({ _id: id }, { $set: status });

      res.json({ message: "New Status:" + status, result: result });
    } catch (e) {
      res.status(400).json({
        e: e,
        message: "Failed to Update Status",
        id: id,
        storeID: store,
      });
    }
  },

  validation: {
    validateCreatePartyData: [
      body("name").notEmpty().escape().isString(),
      body("partySize").notEmpty().isNumeric(),
      body("reservationDate")
        .optional()
        .matches(dateRegex)
        .withMessage("format: new Date() objects | YYYY-MM-DDTHH:mm:ss.SSSZ"),
      body("checkInTime").optional().matches(dateRegex),
      body("status")
        .optional()
        .isIn(["Active", "Finished", "Canceled"])
        .withMessage("Active, Finished, or Canceled Only"),
      body("phoneNumber").isMobilePhone(["en-US"], { strictMode: false }),
      cookie("storeID").escape().notEmpty(),
      helperFunctions.expressValidationMiddleware,
    ],
    validatePartyTimeData: [
      body("checkInTime").matches(dateRegex).optional(),
      body("time")
        .matches(dateRegex)
        .optional()
        .withMessage("for startDining Time: Must be of type Data"),
      body("isEntreeOnTable").isBoolean().optional(),
      helperFunctions.expressValidationMiddleware,
      // body("waitingTime").matches(dateRegex).optional(),
    ],
    validateStatusData: [
      body("status").escape().isIn(["Active", "Finished", "Canceled"]),
      helperFunctions.expressValidationMiddleware,
    ],
  },
};

// THH:mm:ss.SSSZ
// .matches(
//   /^((\+1|1)?( |-)?)?(\(([2-9])(?:\d(?!\5)\d|(?!\5)\d\d)\)|([2-9])(?:\d(?!\6)\d|(?!\6)\d\d))( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/
// ),

export default partyController;
