import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { UserInterface } from "../model/User";
import { ValidationError } from "express-validation";

export const helperFunctions = {
  isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserInterface;
    if (user) {
      next();
    } else {
      res.status(401).json({
        error: "Not authenticated, login at: /api/login",
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
    }

    return res.status(500).json(err);
  },
};
