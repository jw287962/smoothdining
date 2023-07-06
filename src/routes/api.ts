import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
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

const express = require("express");
const router = express.Router();

router.use(passport.session());
/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  // res.send("respond");
  res.json({ api: "beta" });
});

router.post(
  "/login",
  validate(loginValidation, {}, {}),
  passport.authenticate("local"),
  userController.userLogin
);

router.get("/logout", userController.userSignout);

router.post(
  "/register",
  validate(registerValidation, {}, {}),
  userController.userRegister
);
// router.use("user", user_controller);
router.use(helperFunctions.handleFormValidationError);

router.use("/account", account);

module.exports = router;
