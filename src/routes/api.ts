import {
  ErrorRequestHandler,
  NextFunction,
  request,
  Request,
  response,
  Response,
} from "express";
// import { userLogin } from "../controller/user_controller";
import passport from "passport";
import { validate, ValidationError } from "express-validation";

import {
  userController,
  loginValidation,
  registerValidation,
} from "../controller/user_controller";
import account from "./ApiRouter/store";
import { helperFunctions } from "../controller/helper_Controller";
import { UserInterface } from "../model/User";

const express = require("express");
const router = express.Router();

// router.use(passport.session());
/* GET home page. */

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ api: "beta" });
});

router.post(
  "/login",
  validate(loginValidation, {}, {}),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: Error, user: UserInterface, info: any) => {
        // console.log(user);
        if (err) {
          console.log("err", err);
          next(err);
        } else if (!user) {
          res
            .status(401)
            .json({ error: "Unauthorized", message: info.message });
        } else {
          req.user = user;

          next();
        }
      }
    )(req, res, next);
  },
  userController.userLogin
);

router.post(
  "/register",
  validate(registerValidation, {}, {}),
  userController.userRegister
);

router.use((req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: UserInterface, info: any) => {
      if (err) {
        console.log("err", err);
        next(err);
      } else if (!user) {
        res.status(401).json({ error: "Unauthorized", message: info.message });
      } else {
        // console.log(user);
        req.user = user;
        next();
      }
    }
  )(req, res, next);
});
router.use(helperFunctions.handleFormValidationError);

router.get("/logout", userController.userSignout);

router.use("/account", account);

module.exports = router;
