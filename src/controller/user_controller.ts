import { NextFunction, Request, Response } from "express";
import User, { UserInterface } from "../model/User";

import { helperFunctions } from "./helper_Controller";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;
const jwt = require("jsonwebtoken");
import { Joi } from "express-validation";
import passport from "passport";

interface RequestSession extends Request {
  sessionID?: string;
}
export const userController = {
  // oauthLogin: (req: RequestSession, res: Response, next: NextFunction) => {
  //   console.log("oauth");
  //   res.json({ message: "OauthLogin" });
  // },
  oauthCallback: (req: RequestSession, res: Response, next: NextFunction) => {
    // const clientRootUrl = `${req.protocol}://${req.get("host")}`;
    // const clientRootUrl = req.get("referrer");
    // console.log("client", clientRootUrl);
    passport.authenticate(
      "google",
      // { successRedirect: clientRootUrl },
      (err: Error, user: UserInterface) => {
        console.log("passport authenticate");
        if (err) {
          // Handle error
          console.log("Passport Oauth Error)", err);
          res
            .status(500)
            .json({ message: "OAuth authentication error", error: err });
        }

        if (!user) {
          console.log("user not found");
          // Handle user not found
          res.status(404).json({ error: "User not found" });
        }
        const token = jwt.sign({ user: user._id }, process.env.SECRET, {
          expiresIn: "24h", // Set the token expiration time as needed
        });
        // res.header("x-access-token", token);
        var responseHTML =
          '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
        responseHTML = responseHTML.replace(
          "%value%",
          JSON.stringify({
            token,
          })
        );
        res.status(200).send(responseHTML);
      }
    )(req, res, next);
  },
  userLogin: (req: RequestSession, res: Response, next: NextFunction) => {
    const user = (req.user as UserInterface)._id;

    try {
      jwt.sign(
        { user: user },
        process.env.SECRET,
        { expiresIn: "1d" },
        (err: Error, token: string) => {
          if (err) {
            res.status(401).json({ message: "JWT SIgn in error", error: err });
          } else {
            // req.headers.authorization = `bearer="${token}"`;
            res.header("x-access-token", token);
            res.json({
              message: "Login Successfully! Welcome!",
              userID: user,
            });
          }
        }
      );
    } catch (e: any) {
      res.status(500).json({ error: e, message: "Failed to login" });
    }
  },

  userSignout: (req: Request, res: Response, next: NextFunction) => {
    try {
      // ADD TO BLOCKED JWT TOKEN
      req.headers.authorization;
      res.json({
        message: "SIGNOUT Successfully",
      });
    } catch (e) {
      res.status(500).json({ message: "signout failed", error: e });
    }
  },
  userRegister: async (req: Request, res: Response, next: NextFunction) => {
    const user = req.body;
    const found = await User.find({ username: user });
    if (found) {
      throw new Error("Username is taken");
    }
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
