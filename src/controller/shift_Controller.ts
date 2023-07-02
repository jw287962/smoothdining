import { Request, Response, NextFunction } from "express";
import Shifts from "../model/stores/Shifts";
import {
  dateRegex,
  groupShiftsType,
  removeTimeinDate,
} from "./helper_Controller";
import { body } from "express-validator";
const shiftController = {
  queryShiftsToday: async (req: Request, res: Response, next: NextFunction) => {
    const store = req.cookies.storeID;
    const date = removeTimeinDate(new Date());
    try {
      const result = await Shifts.find({ date: date, store: store });

      res.json({ message: "Succesfully Queried Shifts Today", result: result });
    } catch (e) {
      res
        .status(400)
        .json({ message: "Failed to query Today's Shifts", error: e });
    }
  },
  queryShiftsDate: async (req: Request, res: Response, next: NextFunction) => {
    const store = req.cookies.storeID;
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
      const result = await Shifts.find({ date: date, store: store });
      const dataFiltered: groupShiftsType = {};
      result.forEach((waiterShift) => {
        const shiftNumber = waiterShift.shiftNumber;
        if (dataFiltered[shiftNumber]) {
          dataFiltered[shiftNumber].push(waiterShift);
        } else {
          dataFiltered[shiftNumber] = [];
        }
      });
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
      const shiftsData = {
        date: date,
        section: shiftData.section,
        waiter: waiter,
        shiftNumber: shiftData.shiftNumber,
        shiftTables: undefined,
      };

      const result = await Shifts.create(shiftsData);

      res.json({
        message: "Succesfully Queried Shifts:" + date,
        result: result,
      });
    } catch (e) {
      res
        .status(400)
        .json({ message: "Failed to query Today's Shifts", error: e });
    }
  },
  addNewPartyTable: async (req: Request, res: Response, next: NextFunction) => {
    const waiterID = req.params.waiterID;
    const party = req.body;
    const date = removeTimeinDate(new Date());
    try {
      const result = Shifts.updateOne({
        _id: waiterID,
        date: date,
      });
    } catch (e) {
      res.status(400).json({ message: "Failed to add Party:" + party.partyID });
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
    ],
  },
};
export default shiftController;
