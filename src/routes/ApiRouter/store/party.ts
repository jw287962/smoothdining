import { Response, Request, NextFunction } from "express";
import partyController from "../../../controller/party_Controller";

const express = require("express");
const router = express.Router();

router.get("/", partyController.queryAllPartyToday);
router.get("/:dateID", partyController.queryAllPartyOnDate);
router.post(
  "/",
  partyController.validation.validateCreatePartyData,
  partyController.createNewParty
);
router.post(
  "/generic",
  partyController.validation.genericPartyData,
  partyController.createGenericPartySize
);
router.put(
  "/:partyID",
  partyController.validation.validateUpdatePartyData,
  partyController.updatePartyDetails
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
