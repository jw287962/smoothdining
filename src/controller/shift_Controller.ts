import { Request, Response, NextFunction } from "express";
import Shifts, { shiftInterface } from "../model/stores/Shifts";
import {
  dateRegex,
  getStoreID,
  groupShiftsType,
  helperFunctions,
  removeTimeinDate,
} from "./helper_Controller";
import { body } from "express-validator";
import { ObjectId } from "mongodb";
import Party, { partyInterface } from "../model/stores/Party";

const groupByShiftNumber = (result: shiftInterface[]) => {
  const dataFiltered: groupShiftsType = {};
  result.forEach((waiterShift) => {
    const updatewaiterPartyData: partyInterface[] = [];

    (waiterShift.shiftTables as unknown as partyInterface[]).forEach((ele) => {
      const times = Math.ceil(ele.partySize / 4);

      for (let i = 0; i < times; i++) {
        updatewaiterPartyData.push(ele);
      }
    });

    (waiterShift.shiftTables as unknown as partyInterface[]) = [
      ...updatewaiterPartyData,
    ];
    const shiftNumber = waiterShift.shiftNumber;
    if (!dataFiltered[shiftNumber]) {
      dataFiltered[shiftNumber] = [];
    }
    dataFiltered[shiftNumber].push(waiterShift);
  });
  // console.log(dataFiltered);

  return dataFiltered;
};
const shiftController = {
  queryShiftsToday: async (req: Request, res: Response, next: NextFunction) => {
    // const store = req.cookies.storeID;
    // const waiter = req.params.waiterID;
    const date = removeTimeinDate(new Date());
    try {
      // const result = await Shifts.find({ date: date, store: store });
      const result = await Shifts.aggregate([
        {
          $match: {
            date: date,
            // waiter: new ObjectId(waiter),
          },
        },
        {
          $lookup: {
            from: "parties",
            localField: "shiftTables",
            foreignField: "_id",
            as: "shiftTables",
          },
        },
      ]);
      const dataFiltered = groupByShiftNumber(result);
      res.json({
        message: "Succesfully Queried Shifts Today",
        result: dataFiltered,
      });
    } catch (e) {
      const json = { message: "Failed to query Today's Shifts", error: e };
      console.log(json);
      res.status(400).json(json);
    }
  },
  queryShiftsDate: async (req: Request, res: Response, next: NextFunction) => {
    const dateID = req.params.dateID;
    if (!Date.parse(dateID)) {
      return res.status(400).json({
        message: "Not Date Format, should be 2023-07-03T00:00:00.000Z",
      });
    }
    // read and create shifts should be allowed to prepare for future
    const date = removeTimeinDate(new Date(dateID));

    try {
      // const result = await Shifts.find({ date: date, waiter: waiter });
      const result = await Shifts.aggregate([
        {
          $match: {
            date: date,
          },
        },
        {
          $sort: {
            section: 1,
          },
        },

        {
          $lookup: {
            from: "waiters",
            localField: "waiter",
            foreignField: "_id",
            as: "waiter",
          },
        },
        {
          $lookup: {
            from: "parties",
            localField: "shiftTables",
            foreignField: "_id",
            pipeline: [
              {
                $sort: {
                  time: 1,
                },
              },
            ],

            as: "shiftTables",
          },
        },
      ]);

      const dataFiltered = groupByShiftNumber(result);
      res.json({
        message: "Succesfully Queried Shifts:" + date,
        result: dataFiltered,
      });
    } catch (e) {
      const json = { message: "Failed to query Today's Shifts", error: e };
      console.log(json);
      res.status(400).json(json);
    }
  },

  createWaiterShiftData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const waiter = req.params.waiterID;
    const parseDateString = req.params.dateID;
    const store = getStoreID(req);
    const date = parseDateString
      ? removeTimeinDate(new Date(parseDateString))
      : removeTimeinDate(new Date());

    const shiftData = req.body;

    try {
      const found = await Shifts.aggregate([
        {
          $lookup: {
            from: "shifts",
            // let: { waiters: new ObjectId(waiter) },
            pipeline: [
              {
                $match: {
                  date: date,
                  shiftNumber: shiftData.shiftNumber,
                  store: new ObjectId(store),
                  waiter: new ObjectId(waiter),
                },
              },
            ],
            as: "samePerson",
          },
        },
        {
          $lookup: {
            from: "shifts",
            let: { sectionNumber: shiftData.section },
            pipeline: [
              {
                $match: {
                  date: date,
                  shiftNumber: shiftData.shiftNumber,
                  store: new ObjectId(store),
                  section: shiftData.section,
                },
              },
            ],
            as: "sectionTaken",
          },
        },
        {
          $project: {
            sectionTaken: { $size: "$sectionTaken" },
            samePerson: { $size: "$samePerson" },
          },
        },
      ]);
      if (found.length > 0 && found[0].sectionTaken > 0) {
        res.status(403).json({
          message: "Section Number is taken!, choose a different section",
          error: "Section Number is taken! Choose a different section",
        });
      } else if (found.length > 0 && found[0].samePerson > 0) {
        res.status(403).json({
          message:
            "You can't choose to work 2 sections on the same shift! Choose a different section",
          error:
            "You can't choose to work 2 sections on the same shift, choose a different section",
        });
      } else {
        // create
        const shiftsData = {
          date: date,
          section: shiftData.section,
          waiter: waiter,
          shiftNumber: shiftData.shiftNumber,
          shiftTables: [],
          store: store,
        };

        const result = await Shifts.create(shiftsData);

        res.json({
          message: "Succesfully Created Shift",
          result: result,
        });
      }
    } catch (err) {
      const json = { message: "Failed to Create New Shift", error: err };
      console.log(json);
      res.status(400).json(json);
    }
  },
  addNewPartyTable: async (req: Request, res: Response, next: NextFunction) => {
    // const waiterID = req.params.waiterID;
    // const shiftNumber = req.params.shiftNumber;
    // const date = removeTimeinDate(new Date());
    const body = req.body;

    // ALSO NEED TO UPDATE STATUS OF PARTY DETAILS TO IN-PROGRESS

    // const pushNew = [];
    // for (let i = 0; i < Math.ceil(body.partySize / 4); i++) {
    //   pushNew.push(new ObjectId(body.partyID));
    // }
    // console.log(body, pushNew);
    try {
      const result = await Shifts.updateOne(
        {
          _id: body.shiftID,
          // _id: waiterID,
          // date: date,
          // shiftNumber: shiftNumber,
        },
        { $addToSet: { shiftTables: new ObjectId(body.partyID) } }
      );

      const partyResult = await Party.updateOne(
        {
          _id: body.partyID,
        },
        {
          $set: {
            dineInTime: new Date(), // Set the dine-in time to the current date/time
            status: "In-Progress", // Set the status to "inprogress"
          },
        }
      );
      res.json({
        message: "appended table to waiter ",
        result: result,
        updatd_party: partyResult,
      });
    } catch (err) {
      const json = { message: "Failed to add Party:" + body.partyID };
      console.log(json);
      res.status(400).json(json);
    }
  },
  updateWaiterShiftData: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const waiterID = req.params.waiterID;
    const shiftNumber = req.params.shiftNumber;
    const shiftData = req.body;

    try {
      const date = removeTimeinDate(new Date());

      const result = await Shifts.updateOne(
        {
          date: date,
          shiftNumber: shiftNumber,
          waiter: new ObjectId(waiterID),
        },
        { $set: shiftData }
      );

      res.json({
        message: "updated Waiter Shift Data",
        result: result,
        date: date,
      });
    } catch (e) {
      const json = {
        shiftData: shiftData,
        error: e,
        message: "Failed to Update Waiter Shift Data",
      };
      console.log(json);
      res.status(400).json(json);
    }
  },
  validation: {
    createWaiterData: [
      body("section")
        .isNumeric()
        .notEmpty()
        .withMessage(
          "Section cannot be empty, Waiters must choose today's section"
        ),
      body("shiftNumber")
        .isNumeric()
        .notEmpty()
        .withMessage(
          "Current ShiftNumber, IE: 0 for morning, 1 for pm. Numerically designed for flexibility "
        ),
      helperFunctions.expressValidationMiddleware,
    ],

    addPartyTableID: [
      body("shiftID")
        .notEmpty()
        .withMessage("ShiftID is required")
        .isString()
        .escape(),
      body("partyID")
        .notEmpty()
        .withMessage("partyID is required")
        .isString()
        .escape(),
      helperFunctions.expressValidationMiddleware,
    ],
    updateWaiterData: [
      body("party")
        .isEmpty()
        .withMessage(
          "To add party use the API: .../store/shifts/party/:waiterID/:shiftNumber"
        ),
      body("section")
        .isNumeric()
        .optional()
        .withMessage(
          "Section cannot be empty, Waiters must choose tonight's section"
        ),
      body("shiftNumber")
        .isNumeric()
        .optional()
        .withMessage(
          "Current ShiftNumber, IE: 0 for morning, 1 for pm. Numerically designed for flexibility "
        ),
      body("date")
        .isEmpty()
        .withMessage("Shifts Data of past date cannot be editted"),
      helperFunctions.expressValidationMiddleware,
    ],
  },
};
export default shiftController;
