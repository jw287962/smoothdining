import { NextFunction, Request, Response } from "express";
// import User from "../model/User";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;

import { Joi } from "express-validation";

exports.getStore = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {};

exports.createStore = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {};

exports.addStoreToAccount = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {};
