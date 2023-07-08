import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../model/User";

import { helperFunctions } from "./helper_Controller";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;

import { Joi } from "express-validation";
export const userController = {
  userLogin: (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.body;
    const user = req.user as UserInterface;
    try {
      res.json({
        message: "login successfully. Welcome" + username,
        userID: user._id,
        host: req.hostname,
      });
    } catch (e: any) {
      res.status(500).json({ error: e, message: "Failed to login" });
    }
  },
  userSignout: (req: Request, res: Response, next: NextFunction) => {
    try {
      req.logout((err) => {
        if (err) {
          throw err;
        }
        res.clearCookie("sessionId");

        res.json({
          message: "SIGNOUT Successfully",
        });
      });
    } catch (e) {
      res.status(500).json({ message: "signout failed", error: e });
    }
  },
  userRegister: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    if (user.repeatpassword != user.password) {
      res.status(401).json({
        error: true,
        message: "Password does not match",
        missingValue: "repeatpassword",
      });
    } else if (!user) {
      res.status(401).json({
        errorCode: "INVALID_REQUEST",
        errorMessage: "User Exists Already",
      });
    } else {
      try {
        const hashSalt = genPassword(user.password);
        const newUser = new User({
          username: user.username,
          hash: hashSalt.hash, //hashed
          salt: hashSalt.salt,
          birthday: user.birthday,
          signUpDate: new Date(),
        });
        const { username, _id, signUpDate } = await User.create(newUser);

        res.json({
          result: { username, signUpDate, user: _id },
          message: "Success",
        });
      } catch (e) {
        res
          .status(401)
          .json({ error: e, message: "Failed to create new User" });
      }
    }
  },
};

export const loginValidation = {
  body: Joi.object({
    username: Joi.string()
      .alphanum()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required()
      .messages({
        "string.alphanum": "Username must only contain alphanumeric characters",
        "string.pattern.base": "Username must be at least 3 characters long",
        "any.required": "Username is required",
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$"))
      .max(30)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one special character",
        "string.max": "Password cannot exceed 30 characters",
        "any.required": "Password is required",
      }),
  }),
};

export const registerValidation = {
  body: Joi.object({
    username: Joi.string()
      .alphanum()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required()
      .messages({
        "string.alphanum": "Username must only contain alphanumeric characters",
        "string.pattern.base": "Username must be at least 3 characters long",
        "any.required": "Username is required",
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$"))
      .max(30)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one special character",
        "string.max": "Password cannot exceed 30 characters",
        "any.required": "Password is required",
      }),
    repeatpassword: Joi.ref("password"),
  }),
};
export default userController;
