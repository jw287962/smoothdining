import { Response, Request, NextFunction } from "express";
import partyController from "../../../controller/party_Controller";

const express = require("express");
const router = express.Router();

router.get("/", partyController.queryAllPartyToday);
router.post(
  "/",
  partyController.validation.validateCreatePartyData,
  partyController.createNewParty
);
router.put(
  "/timeData/:partyID",
  partyController.validation.validatePartyTimeData,
  partyController.setPartyTimeData
);
router.put(
  "/status/:partyID",
  partyController.validation.validateStatusData,
  partyController.setPartyStatus
);
module.exports = router;
