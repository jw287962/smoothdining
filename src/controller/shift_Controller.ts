import { Request, Response, NextFunction } from "express";
import Shifts from "../model/stores/Shifts";
const shiftController = {
  queryShiftsToday: async (req: Request, res: Response, next: NextFunction) => {
    const store = req.cookies.storeID;
    const date = new Date().setHours(0, 0, 0, 0);
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
    const date = new Date(req.params.dateID);
    date.setHours(0, 0, 0, 0);
    try {
      const result = await Shifts.find({ date: date, store: store });

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
};
export default shiftController;
