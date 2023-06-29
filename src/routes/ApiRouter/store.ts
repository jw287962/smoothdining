import { NextFunction, Request, Response } from "express";

const express = require("express");
const router = express.Router();

import { validate } from "express-validation";

import {
  storecontroller,
  validateStoreData,
} from "../../controller/store_controller";
import { helperFunctions } from "../../controller/helper_Controller";

/* GET home page. */
router.use(helperFunctions.isAuthenticated);

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.json({ message: "implementing Store creation to add to account" });
});

router.get("/store", storecontroller.getStores);
router.post(
  "/store",
  validate(validateStoreData, {}, {}),
  storecontroller.createStore
);
router.use(helperFunctions.handleFormValidationError);
export default router;
// within /account/....
