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
module.exports = router;
