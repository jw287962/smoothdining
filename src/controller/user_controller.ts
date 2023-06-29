import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;

import { Joi } from "express-validation";

exports.userLogin = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;

  res.send("login successfully. Welcome " + username);
};

exports.userRegister = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, password, birthday } = req.body;
  // await User.findOne({ username: username });

  const user = false;
  console.log("user", username, password);
  if (user) {
    res.status(401).json({
      errorCode: "INVALID_REQUEST",
      errorMessage: "User Exists Already",
      // details: {
      //   validationErrors: [
      //     {
      //       field: "email",
      //       message: "Email is required",
      //     },
      //     {
      //       field: "password",
      //       message: "Password must be at least 6 characters",
      //     },
      //   ],
      // },
    });
  } else {
    try {
      const hashSalt = genPassword(password);
      const user = new User({
        username: username,
        hash: hashSalt.hash, //hashed
        salt: hashSalt.salt,
        birthday: birthday,
        signUpDate: new Date(),
      });
      const result = await User.create(user);
      res.json({ user: result, message: "Welcome new User" });
    } catch (e) {
      res.status(401).json({ e: e, message: "Failed to create new User" });
    }
  }
  // } catch (e) {
  //   res.status(401).json({ e: e, message: "error" });
  // }
};

export const loginValidation = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};
