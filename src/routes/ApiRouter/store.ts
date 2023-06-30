import { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();

const waiters = require("./store/waiters");
const shifts = require("./store/shifts");
const party = require("./store/party");

import { validate } from "express-validation";

import {
  storecontroller,
  validateStoreData,
} from "../../controller/store_controller";
import { helperFunctions } from "../../controller/helper_Controller";

/* GET home page. */

router.use(helperFunctions.isAuthenticatedOwner);

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ message: "implementing Store creation to add to account" });
});

router.get("/store", storecontroller.getStores);
router.post(
  "/store",
  validate(validateStoreData, {}, {}),
  storecontroller.createStore
);
router.use("/store/waiters", waiters);
router.use("/store/shifts", shifts);
router.use("/store/party", party);
router.use(helperFunctions.handleFormValidationError);
export default router;
// within /account/....
