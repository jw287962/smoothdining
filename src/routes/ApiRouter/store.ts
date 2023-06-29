import { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ message: "implementing Store creation to add to account" });
});

router.get("/store");
export default router;
