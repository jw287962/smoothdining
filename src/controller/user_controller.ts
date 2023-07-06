import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../model/User";

import { helperFunctions } from "./helper_Controller";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;

import { Joi } from "express-validation";
export const userController = {
  userLogin: (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const user = req.user as UserInterface;
    // res.setHeader("Set-Cookie", `user=${JSON.stringify(user._id)}; Path=/`);

    res.json({
      message: "login successfully. Welcome" + username,
      userID: user._id,
    });
  },
  userRegister: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    if (user.repeatpassword != user.password) {
      res.status(401).json({
        error: true,
        message: "Password does not match",
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
          result: { username, _id, signUpDate },
          message: "Welcome new User",
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
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$"))
      .max(30)
      .required(),
  }),
};

export const registerValidation = {
  body: Joi.object({
    username: Joi.string()
      .alphanum()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$"))
      .max(30)
      .required(),
    repeatpassword: Joi.ref("password"),
  }),
};
export default userController;
