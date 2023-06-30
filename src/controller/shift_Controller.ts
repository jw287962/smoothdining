import { Request, Response, NextFunction } from "express";
import Shifts from "../model/stores/Shifts";
const shiftController = {
  queryShiftsDate: (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "query shifts of day" });
  },
};
export default shiftController;
