import { NextFunction, Request, Response } from "express";
import { helperFunctions } from "../../../controller/helper_Controller";

import { waiterController } from "../../../controller/waiters_Controller";
const express = require("express");
const router = express.Router();

// /api/account/store/waiter
router.get(
  "/",
  waiterController.validateHeaderStoreData,
  waiterController.getAllWaiters
);

router.post(
  "/",
  waiterController.validateHeaderStoreData,
  waiterController.validateBodyWaiterData,
  waiterController.addNewWaiter
);

router.post(
  "/:waiterID",
  waiterController.validateHeaderStoreData,
  waiterController.validateBodyWaiterData,
  waiterController.updateWaiter
);
router.use(helperFunctions.handleFormValidationError);
module.exports = router;
