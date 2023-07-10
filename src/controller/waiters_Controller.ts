import { NextFunction, Request, Response } from "express";
import { UserInterface } from "../model/User";
import Waiter from "../model/stores/Waiter";
import {
  body,
  cookie,
  header,
  query,
  validationResult,
} from "express-validator";
import { Db, ObjectId } from "mongodb";
import { helperFunctions, parseStatusQuery } from "./helper_Controller";
import { request } from "http";

// interface headerData extends Record<string, string | string[] | undefined> {
//   storeID: string;
// }

interface RequestEdit extends Request {
  headers: {
    storeid?: string;
  };
}

export const waiterController = {
  getAllWaiters: async (
    req: RequestEdit,
    res: Response,
    next: NextFunction
  ) => {
    const headers = req.cookies;

    const status = parseStatusQuery(req.query);
    try {
      const result = await Waiter.find({
        store: new ObjectId(headers.storeid),
        status: status,
      });
      res.json({ result: result });
    } catch (e) {
      res.json({
        e: e,
        message: "failed to get all waiters",
        controller: "getAllWaiters",
      });
    }
  },
  addNewWaiter: async (req: RequestEdit, res: Response, next: NextFunction) => {
    const header = req.cookies;
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
        store: header.storeid,
        isActive: true,
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
        storeID: header.storeid,
        controller: "addNewWaiter",
      });
    }
  },

  validateHeaderStoreData: async (
    req: RequestEdit,
    res: Response,
    next: NextFunction
  ) => {
    const header = req.cookies;
    if (header.storeid) {
      next();
    } else {
      res.status(400).json({
        error:
          "Missing store Header Data in WaiterController in req.cookies.storeID",
        controller: "validateHeaderStoreData",
        // header: header,
      });
    }
  },
  validation: {
    validateBodyWaiterData: [
      body("name").escape(),
      body("birthdate").optional().escape().default(undefined),
      cookie("storeid").escape(),
      body("maxActiveTableForPermission").isNumeric().optional(),
      body("waitToSitUntilEntreeOut").isNumeric().optional(),
      helperFunctions.expressValidationMiddleware,
    ],
    // queryDataisActiveCheck: [body("isActive").optional().isBoolean()],
  },

  updateWaiter: async (req: RequestEdit, res: Response, next: NextFunction) => {
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
        Object.entries(updateData).filter(
          ([key, value]) => value !== undefined && value !== null
        )
      );

      const result = await Waiter.updateOne(
        { _id: new ObjectId(req.params.waiterID) },
        { $set: filteredUpdateData }
      );
      res.json({
        wantToUpdateData: filteredUpdateData,
        result: result,
        message: "updated Data for Waiter",
      });
    } catch (e) {
      res.status(500).json({
        error: e,
        message: "Failed to update data",
        controller: "updateWaiter",
      });
    }
  },
};
