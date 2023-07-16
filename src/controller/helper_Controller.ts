import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { UserInterface } from "../model/User";
import { ValidationError } from "express-validation";
import { validationResult } from "express-validator";
import { shiftInterface } from "../model/stores/Shifts";
import { Types } from "mongoose";
import { dbString } from "../app";
import { addHours, format } from "date-fns";

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
export const helperFunctions = {
  userHasStoreID: (req: Request, res: Response, next: NextFunction) => {
    const storeID: string = getStoreID(req);
    const checkStoreID = (value: Types.ObjectId) => {
      return value.equals(storeID);
    };

    const user = req.user as UserInterface;
    if (!req.cookies.storeid && !req.params.storeID && !req.headers.storeid) {
      next();
    } else if ((user.store as unknown as Types.ObjectId[]).some(checkStoreID)) {
      next();
    } else {
      res.status(401).json({
        message: "You do not have permission to view this store! ",
        directHeader: req.headers.storeid,
      });
    }
  },
  isAuthenticatedOwner: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserInterface;
    // if (user) {
    //   res.locals.login = { login: true, roles: user.role };
    // }
    if (user && user.role === "Owner") {
      next();
    } else {
      const json = {
        user: user,
        error: "Not authenticated, or non-owner role. login at: /api/login",
        login: false,
      };
      console.log(json);
      res.status(401).json(json);
    }
  },

  handleFormValidationError: function (
    err: ValidationError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (err.name === "ValidationError") {
        const errorMessage = err.details?.body?.[0].message;
        res.status(err.statusCode).json({ error: err, message: errorMessage });
      } else if (err) {
        console.log("handleForm error, not a validation error", err);
        res.status(500).json({
          error: err,
          message: "handleForm Error| not a validation error",
        });
      } else {
        next();
      }
    } catch (e) {
      const json = { error: e, message: "Form Validation Failed" };
      console.log(json);

      res.status(400).json(json);
    }
  },

  expressValidationMiddleware: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
    } else {
      const json = {
        error: result.array(),
        message: "ExpressValidation Failed",
      };
      console.log(json);

      res.status(400).json(json);
    }
    // } catch (e) {
    //   res.status(400).json({ error: e, message: "expressValidationFailed" });
    // }
  },
  nocache: (req: Request, res: Response, next: NextFunction) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    next();
  },
};

export function removeTimeinDate(date: Date) {
  const dateFormat = format(new Date(date), "yyyy-MM-dd");
  // console.log(new Date(dateFormat));
  return dateFormat;
}

export function parseStatusQuery(query: Request["query"]): boolean | undefined {
  if (typeof query.status === "string") {
    query.status.toLowerCase();
  }
  const isActive =
    query.status === "true" || query.status === "false"
      ? JSON.parse(query.status)
      : undefined;

  return isActive;
}

export type groupShiftsType = Record<number, shiftInterface[]>;
export const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function getStoreID(req: Request) {
  return req.cookies.storeid || req.params.storeID || req.headers.storeid;
}

