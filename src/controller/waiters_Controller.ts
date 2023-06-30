import { NextFunction, Request, Response } from "express";
import { UserInterface } from "../model/User";
import Waiter from "../model/stores/Waiter";
import { body, header, query, validationResult } from "express-validator";
import { Db } from "mongodb";
import { helperFunctions } from "./helper_Controller";

// interface headerData extends Record<string, string | string[] | undefined> {
//   storeID: string;
// }

declare module "express" {
  interface Request {
    headers: {
      storeID?: string;
    };
  }
}
export const waiterController = {
  getAllWaiters: async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers;

    try {
      const result = await Waiter.find({ store: header.storeID });
      res.json({ result: result });
    } catch (e) {
      res.json({ e: e, message: "failed to get all waiters" });
    }
  },
  addNewWaiter: async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers;
    const waiterFormData = req.body;

    try {
      const newWaiter = new Waiter({
        name: waiterFormData.name,
        birthdate: waiterFormData.birthdate,
        preferences: {
          maxActiveTableForPermission:
            waiterFormData.maxActiveTableForPermission,
          waitToSitUntilEntreeOut: waiterFormData.waitToSitUntilEntreeOut,
        },
        store: header.storeID,
      });

      const waiter = await Waiter.create(newWaiter);
      res.json({
        message: "Created Waiter:" + waiter.name,
        newWaiter: newWaiter,
      });
    } catch (e) {
      res.json({
        e: e,
        message: "failed to add new Waiter with Store Data:",
        storeID: header.storeID,
      });
    }
  },

  validateHeaderStoreData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const header = req.headers;
    if (header.storeID) {
      next();
    } else {
      res.status(400).json({ error: "Missing store Header Data" });
    }
  },
  validateBodyWaiterData:
    (body("name").notEmpty().escape(),
    body("birthdate").escape(),
    header("storeID").escape(),
    body("maxActiveTableForPermission").isNumeric(),
    body("waitToSitUntilEntreeOut").isNumeric(),
    helperFunctions.expressValidationMiddleware),
    
  updateWaiter: async (req: Request, res: Response, next: NextFunction) => {
    const updateData = {
      name: req.body.name,
      age: req.body.age,
      birthdate: req.body.birthdate,
      preferences: {
        maxActiveTableForPermission: req.body.maxActiveTableForPermission,
        waitToSitUntilEntreeOut: req.body.waitToSitUntilEntreeOut,
      },
      // ...
    };

    // Filter out undefined values
    try {
      const filteredUpdateData = Object.fromEntries(
        Object.entries(updateData).filter(([key, value]) => value !== undefined)
      );
      const result = await Waiter.updateOne(
        { _id: req.params.waiterID },
        { $set: filteredUpdateData }
      );
      res.json({
        wantToUpdateData: filteredUpdateData,
        result: result,
        message: "updated Data for Waiter",
      });
    } catch (e) {
      res.status(500).json({ error: e, message: "Failed to update data" });
    }
  },
};
