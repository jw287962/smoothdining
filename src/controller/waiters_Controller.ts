import { NextFunction, Request, Response } from "express";
import Waiter from "../model/stores/Waiter";

import { body, cookie } from "express-validator";
import { Db, ObjectId } from "mongodb";
import {
  getStoreID,
  helperFunctions,
  parseStatusQuery,
} from "./helper_Controller";

// interface headerData extends Record<string, string | string[] | undefined> {
//   storeID: string;
// }

interface RequestEdit extends Request {
  headers: {
    storeid?: string;
  };
}

interface waiterFinderType {
  store: ObjectId;
  status?: boolean;
}

export const waiterController = {
  getAllWaiters: async (
    req: RequestEdit,
    res: Response,
    next: NextFunction
  ) => {
    const headers = getStoreID(req);

    const status = parseStatusQuery(req.query);
    const search: waiterFinderType = { store: new ObjectId(headers) };
    if (typeof status === "boolean") {
      search.status = status;
    }
    try {
      const result = await Waiter.find(search).sort({ name: 1 });

      res.json({ result: result });
    } catch (e) {
      res.status(400).json({
        error: e,
        message:
          "failed to get all waiters. takes params or cookie header of storeID",
        controller: "getAllWaiters",
        headers: req.headers.storeid && "Exists",
      });
      console.log(headers);
    }
  },
  addNewWaiter: async (req: RequestEdit, res: Response, next: NextFunction) => {
    const header =
      req.cookies.storeid || req.params.storeID || req.headers.storeid;
    const waiterFormData = req.body;
    const found = await Waiter.find({
      $and: [
        { store: { $eq: header } },
        { name: { $eq: waiterFormData.name } },
      ],
    });
    try {
      if (found.length > 0) {
        throw new Error("Name is taken");
      }
      const newWaiter = new Waiter({
        name: waiterFormData.name,
        birthdate: waiterFormData.birthdate,
        preferences: {
          maxActiveTableForPermission:
            waiterFormData.maxActiveTableForPermission,
          waitToSitUntilEntreeOut: waiterFormData.waitToSitUntilEntreeOut,
        },
        store: header,
        isActive: true,
      });
      const waiter = await Waiter.create(newWaiter);

      res.json({
        message: "Created Waiter:" + waiter.name,
        newWaiter: newWaiter,
      });
    } catch (e: any) {
      console.log(e);
      res.json({
        error: e.message,
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
    const header =
      req.cookies.storeid || req.params.storeID || req.headers.storeid;
    if (header) {
      next();
    } else {
      res.status(400).json({
        error:
          "Missing store Header Data in req.headers.storeid or req.params.storeid in WaiterController",
        controller: "validateHeaderStoreData",
        // headers: req.headers,
        // header: req.header,
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
