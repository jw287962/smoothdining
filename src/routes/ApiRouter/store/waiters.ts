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
  waiterController.validation.validateBodyWaiterData,
  waiterController.addNewWaiter
);

router.patch(
  "/:waiterID",
  waiterController.validateHeaderStoreData,
  waiterController.validation.validateBodyWaiterData,
  waiterController.updateWaiter
);
router.use(helperFunctions.handleFormValidationError);
module.exports = router;
