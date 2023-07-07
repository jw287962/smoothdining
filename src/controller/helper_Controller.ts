import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { UserInterface } from "../model/User";
import { ValidationError } from "express-validation";
import { validationResult } from "express-validator";
import { shiftInterface } from "../model/stores/Shifts";

export const helperFunctions = {
  isAuthenticatedOwner: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserInterface;
    // if (user) {
    //   res.locals.login = { login: true, roles: user.role };
    // }
    if (user && user.role === "Owner") {
      next();
    } else {
      console.log("isAuthOwnerFailed");

      res.status(401).json({
        user: user,
        error: "Not authenticated, or non-owner role. login at: /api/login",
        login: false,
      });
    }
  },

  handleFormValidationError: function (
    err: ValidationError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("handleform error");
      if (err.name === "ValidationError") {
        const errorMessage = err.details?.body?.[0].message;
        res.status(err.statusCode).json({ error: err, message: errorMessage });
      } else if (err) {
        console.log("handleForm error", err);
        res.status(500).json({ error: err, message: "handleForm Error" });
      } else {
        next();
      }
    } catch (e) {
      console.log(" handleFOrmvalid", e);

      res.status(400).json({ error: e, message: "Form Validation Failed" });
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
      res
        .status(400)
        .send({ error: result.array(), message: "ExpressValidation Failed" });
    }
    // } catch (e) {
    //   res.status(400).json({ error: e, message: "expressValidationFailed" });
    // }
  },
};

export function removeTimeinDate(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}

export function parseStatusQuery(query: Request["query"]) {
  const isActive =
    query.status === "true" || query.status === "false"
      ? JSON.parse(query.status.toLowerCase())
      : undefined;

  return isActive;
}

export type groupShiftsType = Record<number, shiftInterface[]>;
export const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
