import { Request, Response, NextFunction } from "express";
import Shifts, { shiftInterface } from "../model/stores/Shifts";
import {
  dateRegex,
  groupShiftsType,
  helperFunctions,
  removeTimeinDate,
} from "./helper_Controller";
import { body } from "express-validator";
import { ObjectId } from "mongodb";

const groupByShiftNumber = (result: shiftInterface[]) => {
  const dataFiltered: groupShiftsType = {};
  result.forEach((waiterShift) => {
    const shiftNumber = waiterShift.shiftNumber;
    if (dataFiltered[shiftNumber]) {
      dataFiltered[shiftNumber].push(waiterShift);
    } else {
      dataFiltered[shiftNumber] = [];
    }
  });

  return dataFiltered;
};
const shiftController = {
  queryShiftsToday: async (req: Request, res: Response, next: NextFunction) => {
    // const store = req.cookies.storeID;
    const waiter = req.params.waiterID;
    const date = removeTimeinDate(new Date());
    try {
      // const result = await Shifts.find({ date: date, store: store });
      const result = await Shifts.aggregate([
        {
          $match: {
            date: date,
            waiter: new ObjectId(waiter),
          },
        },
        {
          $lookup: {
            from: "parties",
            localField: "shiftTables",
            foreignField: "_id",
            as: "shiftTables",
          },
        },
      ]);
      const dataFiltered = groupByShiftNumber(result);
      res.json({
        message: "Succesfully Queried Shifts Today",
        result: dataFiltered,
      });
    } catch (e) {
      res
        .status(400)
        .json({ message: "Failed to query Today's Shifts", error: e });
    }
  },
  queryShiftsDate: async (req: Request, res: Response, next: NextFunction) => {
    // const store = req.cookies.storeID;
    const waiter = req.params.waiterID;
    const dateID = req.params.dateID;
    if (!Date.parse(dateID)) {
      return res.status(400).json({
        message: "Not Date Format, should be 2023-07-03T00:00:00.000Z",
      });
    }
    if (
      new Date(dateID).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0)
    ) {
      return res.status(400).json({ message: "Cannot query future dates" });
    }

    const date = removeTimeinDate(new Date());

    try {
      // const result = await Shifts.find({ date: date, waiter: waiter });
      const result = await Shifts.aggregate([
        {
          $match: {
            date: date,
            waiter: new ObjectId(waiter),
          },
        },
        {
          $lookup: {
            from: "Party",
            localField: "shiftTables",
            foreignField: "_id",
            as: "shiftTables",
          },
        },
      ]);
      const dataFiltered = groupByShiftNumber(result);
      res.json({
        message: "Succesfully Queried Shifts:" + date,
        result: dataFiltered,
      });
    } catch (e) {
      res
        .status(400)
        .json({ message: "Failed to query Today's Shifts", error: e });
    }
  },

  createWaiterShiftData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const waiter = req.params.waiterID;

    const date = removeTimeinDate(new Date());
    const shiftData = req.body;

    try {
      const found = await Shifts.find({
        date: date,
        shiftNumber: shiftData.shiftNumber,
        section: shiftData.section,
      });
      if (found) {
        res.status(403).json({
          message: "Shift Number is taken!, choose a different section",
          error: "error",
        });
      } else {
        const shiftsData = {
          date: date,
          section: shiftData.section,
          waiter: waiter,
          shiftNumber: shiftData.shiftNumber,
          shiftTables: [],
        };

        const result = await Shifts.create(shiftsData);

        res.json({
          message: "Succesfully Created Shifts",
          result: result,
        });
      }
    } catch (e) {
      res.status(400).json({ message: "Failed to Create New Shift", error: e });
    }
  },
  addNewPartyTable: async (req: Request, res: Response, next: NextFunction) => {
    const waiterID = req.params.waiterID;
    const shiftNumber = req.params.shiftNumber;
    const party = req.body;

    const date = removeTimeinDate(new Date());
    try {
      const result = await Shifts.updateOne(
        {
          _id: waiterID,
          date: date,
          shiftNumber: shiftNumber,
        },
        { $push: { shiftTables: new ObjectId(party) } }
      );
      res.json({
        message: "appended table to waiter ",
        result: result,
      });
    } catch (e) {
      res.status(400).json({ message: "Failed to add Party:" + party.partyID });
    }
  },
  updateWaiterShiftData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const waiterID = req.params.waiterID;
    const shiftNumber = req.params.shiftNumber;
    const shiftData = req.body;

    try {
      const date = removeTimeinDate(new Date());

      const result = await Shifts.updateOne(
        {
          date: date,
          shiftNumber: shiftNumber,
          waiter: new ObjectId(waiterID),
        },
        { $set: shiftData }
      );

      res.json({
        message: "updated Waiter Shift Data",
        result: result,
        date: date,
      });
    } catch (e) {
      res.status(400).json({
        shiftData: shiftData,
        error: e,
        message: "Failed to Update Waiter Shift Data",
      });
    }
  },
  validation: {
    createWaiterData: [
      body("section")
        .isNumeric()
        .notEmpty()
        .withMessage(
          "Section cannot be empty, Waiters must choose tonight's section"
        ),
      body("shiftNumber")
        .isNumeric()
        .notEmpty()
        .withMessage(
          "Current ShiftNumber, IE: 0 for morning, 1 for pm. Numerically designed for flexibility "
        ),
      helperFunctions.expressValidationMiddleware,
    ],

    addPartyTableID: [
      body("party").notEmpty().isString().escape(),
      helperFunctions.expressValidationMiddleware,
    ],
    updateWaiterData: [
      body("party")
        .isEmpty()
        .withMessage(
          "To add party use the API: .../store/shifts/party/:waiterID/:shiftNumber"
        ),
      body("section")
        .isNumeric()
        .optional()
        .withMessage(
          "Section cannot be empty, Waiters must choose tonight's section"
        ),
      body("shiftNumber")
        .isNumeric()
        .optional()
        .withMessage(
          "Current ShiftNumber, IE: 0 for morning, 1 for pm. Numerically designed for flexibility "
        ),
      body("date")
        .isEmpty()
        .withMessage("Shifts Data of past date cannot be editted"),
      helperFunctions.expressValidationMiddleware,
    ],
  },
};
export default shiftController;
