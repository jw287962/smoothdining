import { Response, Request, NextFunction } from "express";

import shiftController from "../../../controller/shift_Controller";
const express = require("express");
const router = express.Router();

router.get("/:waiterID", shiftController.queryShiftsToday);

router.get("/waiterID/:dateID", shiftController.queryShiftsDate);

router.post(
  "/waiterID",
  shiftController.validation.createWaiterData,
  shiftController.createWaiterShiftData
);

router.put(
  "/:waiterID/:shiftNumber",
  shiftController.validation.addPartyTableID,
  shiftController.addNewPartyTable
);
module.exports = router;
