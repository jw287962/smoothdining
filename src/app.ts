import { Express, NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import mongoose from "mongoose";
import passport from "passport";
// const { Express, NextFunction, Request, Response } = require("express");
// const { HttpError } = require("http-errors");
// const { MongoClient, ServerApiVersion } = require("mongodb");
const session = require("express-session");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");

const dotenv = require("dotenv").config();

const app: Express = express();
// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: true,
    resave: false,
  })
);
app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const dbString: string =
  process.env.MONGODB_URI ||
  "mongodb+srv://your_user_name:your_password@cluster0.lz91hw2.mongodb.net/blog-api?retryWrites=true&w=majority";

// const client = new MongoClient(dbString, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });
async function run() {
  await mongoose.connect(dbString);
  console.log("You successfully connected to MongoDB! ");
}
run().catch((err) => console.log(err));
export default app;
