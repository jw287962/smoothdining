import { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("index", { title: "Smooth Dining API" });
});

router.get("/docs", function (req: Request, res: Response, next: NextFunction) {
  res.render("docs", { title: "Smooth Dining API" });
});

module.exports = router;
