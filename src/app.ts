import {
  Express,
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from "express";
import { HttpError } from "http-errors";
import mongoose from "mongoose";
// const { Express, NextFunction, Request, Response } = require("express");
// const { HttpError } = require("http-errors");
// const { MongoClient, ServerApiVersion } = require("mongodb");

const cors = require("cors");

// const session = require("express-session");

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

// CORS
const allowedOrigins = [
  "https://jw287962.github.io",
  "https://smoothdining.netlify.app",
  "http://localhost:4200",
];
const corsOptions = {
  origin: (origin: string, callback: any) => {
    var originIsWhitelisted = allowedOrigins.indexOf(origin) !== -1;
    if (!originIsWhitelisted) {
      console.log(origin);
    }
    callback(null, originIsWhitelisted);
  },
  credentials: true,
  allowedHeaders: [
    "Content-Type",
    "POST",
    "GET",
    "OPTIONS",
    "DELETE",
    "Cookie",
    "storeid",
    "Authorization",
  ],
};
export const dbString: string =
  process.env.MONGODB_URI ||
  process.env.CUSTOMCONNSTR_MONGODB_URI ||
  "mongodb+srv://your_user_name:your_password@cluster0.lz91hw2.mongodb.net/blog-api?retryWrites=true&w=majority";

// const store = new MongoDBStore({
//   uri: dbString, // MongoDB connection URI
//   collection: "sessions", // Collection name for session data
// });

// app.set("trust proxy", true);
// app.use(
// session({
//   name: "sessionId",
//   secret: process.env.SECRET,
//   saveUninitialized: false, //Should set to false in production
//   resave: false,
//   store: store,
//   Headers: {}
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24,
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: process.env.NODE_ENV === "production" ? true : false,
//   },
//   proxy: true,
// })
// );
app.use(cors(corsOptions));
// view engine setup

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60,
});

// Apply rate limiter to all requests
app.use(limiter);

// app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));
app.use((req, res: Response, next: NextFunction) => {
  //   // res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  //   // res.header("Access-Control-Allow-Credentials", "true"); // allow sending and receiving cookies
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Expose-Headers", "x-access-token");
  next();
});

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req, res: Response, next: NextFunction) => {
  console.log("app.ts Main error");
  let err = new HttpError("Not found");
  err.status = 404;
  next(err);
});

// interface Errors extends Error {
//   status: number;
// }
// error handler

const errorHandle: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle errors
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
};

app.use(errorHandle);

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
