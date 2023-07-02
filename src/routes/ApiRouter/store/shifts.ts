import { Response, Request, NextFunction } from "express";

import shiftController from "../../../controller/shift_Controller";
const express = require("express");
const router = express.Router();

router.get("/", shiftController.queryShiftsToday);

router.get("/:dateID", shiftController.queryShiftsDate);

router.post(
  "/waiterID",
  shiftController.validation.createWaiterData,
  shiftController.createWaiterShiftData
);

router.put(":waiterID", shiftController.addNewPartyTable);
module.exports = router;
