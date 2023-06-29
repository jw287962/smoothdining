import passport, { DoneCallback } from "passport";
import passportLocal, {
  IStrategyOptions,
  IStrategyOptionsWithRequest,
} from "passport-local";

import User from "./model/User";
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

const LocalStrategy = passportLocal.Strategy;

type VerifyCallback = passportLocal.VerifyFunction;
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },

    function (username: string, password: string, cb) {
      // console.log(email);
      return User.findOne({ username })
        .then((user) => {
          if (!user) {
            return cb(null, false, {
              message: "Incorrect username.",
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
        .catch((err) => cb(err));
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

passport.serializeUser(function (user: any, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// checking

// module.exports.verifyToken = function verifyToken(req, res, next) {
//   const token = req.headers["token"];
//   if (typeof token !== "undefined") {
//     req.token = token;
//     next();
//   } else {
//     next();
//   }
// };
