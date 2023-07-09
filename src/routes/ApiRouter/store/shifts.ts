import { Response, Request, NextFunction } from "express";

import shiftController from "../../../controller/shift_Controller";
import { helperFunctions } from "../../../controller/helper_Controller";
const express = require("express");
const router = express.Router();

router.use(helperFunctions.userHasStoreID);
router.get("/:waiterID", shiftController.queryShiftsToday);

router.get("/:waiterID/:dateID", shiftController.queryShiftsDate);

router.post(
  "/:waiterID",
  shiftController.validation.createWaiterData,
  shiftController.createWaiterShiftData
);

router.put(
  "/:waiterID/:shiftNumber",
  shiftController.validation.updateWaiterData,
  shiftController.updateWaiterShiftData
);

router.put(
  "/party/:waiterID/:shiftNumber",
  shiftController.validation.addPartyTableID,
  shiftController.addNewPartyTable
);
module.exports = router;
