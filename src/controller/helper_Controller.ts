import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { UserInterface } from "../model/User";
import { ValidationError } from "express-validation";
import { validationResult } from "express-validator";

export const helperFunctions = {
  isAuthenticatedOwner: (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as UserInterface;
    if (user && user.role === "Owner") {
      next();
    } else {
      res.status(401).json({
        user: user,
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

  expressValidationMiddleware: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      next();
    } else {
      res.send({ error: result.array() });
    }
  },
};
