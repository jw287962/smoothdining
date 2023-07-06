import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { UserInterface } from "../model/User";
import { ValidationError } from "express-validation";
import { validationResult } from "express-validator";
import { shiftInterface } from "../model/stores/Shifts";

export const helperFunctions = {
  isAuthenticatedOwner: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserInterface;

    if (user) {
      (res.locals.login = true), { role: user.role };
    }
    if (user && user.role === "Owner") {
      next();
    } else {
      res.status(401).json({
        user: user,
        error: "Not authenticated, or non-owner role. login at: /api/login",
        login: false,
      });
    }
  },

  handleFormValidationError: function (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json(err);
    } else if (err) {
      return res.status(500).json(err);
    } else {
      next();
    }
  },

  expressValidationMiddleware: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
    } else {
      res.status(400).send({ error: result.array() });
    }
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
