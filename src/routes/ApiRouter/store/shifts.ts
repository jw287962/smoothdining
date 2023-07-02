import { Response, Request, NextFunction } from "express";

import shiftController from "../../../controller/shift_Controller";
const express = require("express");
const router = express.Router();

router.get("/", shiftController.queryShiftsToday);

router.get("/:dateID", shiftController.queryShiftsDate);

module.exports = router;
