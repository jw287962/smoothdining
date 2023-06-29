import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
// import { userLogin } from "../controller/user_controller";
import passport from "passport";
import { loginValidation } from "../controller/user_controller";
import { validate, ValidationError } from "express-validation";

const userLogin_Controller = require("../controller/user_controller");

import account from "./ApiRouter/store";

const express = require("express");
const router = express.Router();

router.use(passport.session());
/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  // res.send("respond");
  res.json({ api: "beta" });
});

router.get(
  "/login",
  // validate(loginValidation, {}, {}),
  passport.authenticate("local"),
  userLogin_Controller.userLogin
);

router.post(
  "/register",
  validate(loginValidation, {}, {}),
  userLogin_Controller.userRegister
);
// router.use("user", user_controller);

router.use(function (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

router.use("/account", account);
module.exports = router;
