import passport, { DoneCallback } from "passport";
import passportLocal, {
  IStrategyOptions,
  IStrategyOptionsWithRequest,
} from "passport-local";

import User, { UserInterface } from "./model/User";
import { JwkKeyExportOptions } from "crypto";
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

const LocalStrategy = passportLocal.Strategy;

type VerifyCallback = passportLocal.VerifyFunction;

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const dotenv = require("dotenv").config();
// console.log("emtpy");
var opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  // issuer: "",
  // audience: "yoursite.net",
};
passport.use(
  new JwtStrategy(opts, async function (jwt_payload: any, done: any) {
    // console.log("hi", jwt_payload, done);

    try {
      const user = await User.findOne({ _id: jwt_payload.user });

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or create a new account
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      session: false,
    },

    function (username: string, password: string, cb) {
      // console.log(email);
      return User.findOne({ username })
        .then((user) => {
          if (!user) {
            return cb(null, false, {
              message: "Incorrect username or password",
            });
          }
          const isValid = validPassword(password, user.hash, user.salt);
          if (isValid) {
            return cb(null, user, { message: "Logged In Successfully" });
          } else {
            return cb(null, false, { message: "Password incorrect" });
            // password wrong
          }
        })
        .catch((err) => {
          console.log("pasport caught error", err);
          cb(err);
        });
    }
  )
);
export const validPassword = (password: string, hash: string, salt: string) => {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
};

// regsitering
// module.exports.validPassword = validPassword;

export const genPassword = function genPassword(password: string) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
};

// passport.serializeUser(function (user: any, done) {
//   console.log("serialize");
//   try {
//     done(null, user.id);
//   } catch (e) {
//     console.log("seralize ERROR");
//   }
// });
// interface checkUser extends UserInterface {
//   login?: Boolean;
// }
// passport.deserializeUser(async function (id, done) {
//   console.log("derialize");
//   try {
//     const user = await User.findById(id);

//     if (user) {
//       // const userSuccess: checkUser = user;
//       // userSuccess.login = true;
//       done(null, user);
//     } else {
//       done(null, user);
//     }
//   } catch (err) {
//     console.log("deserailize ERROR", err);
//     done(err);
//   }
// });

// // checking

// // module.exports.verifyToken = function verifyToken(req, res, next) {
// //   const token = req.headers["token"];
// //   if (typeof token !== "undefined") {
// //     req.token = token;
// //     next();
// //   } else {
// //     next();
// //   }
// // };
