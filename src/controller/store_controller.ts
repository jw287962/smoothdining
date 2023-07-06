import { NextFunction, Request, Response } from "express";
// import User from "../model/User";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;

import { Joi } from "express-validation";

import Store, { storeInterface } from "../model/stores/Store";
import User, { UserInterface } from "../model/User";
import { ObjectId } from "mongodb";

export const storecontroller = {
  getStores: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as UserInterface;
      // const sessionID = req.?sessionID;

      const result = await User.aggregate([
        {
          $match: {
            _id: user._id,
          },
        },
        {
          $lookup: {
            from: "stores",
            localField: "store",
            foreignField: "_id",
            as: "populatedStore",
          },
        },
      ]);
      res.json({ user: user._id, result: result[0].populatedStore });
    } catch (e) {
      res.status(400).json({
        message: "failed to get stores of user",
        error: e,
        controller: "getStores",
      });
    }
  },

  getStoreData: async (req: Request, res: Response, next: NextFunction) => {
    const storeID: string = req.params.storeID;

    if (storeID) {
      try {
        const user = req.user as UserInterface;

        const data = await Store.findById(new ObjectId(storeID));
        res.setHeader(
          "Set-Cookie",
          `storeID=${storeID}; Path=/api/account/store; HttpOnly; Secure; SameSite=Strict`
        );
        // ;HttpOnly; Secure;
        res.json({ store: data, results: storeID });
      } catch (e) {
        res.status(400).json({
          message: "failed to get specific store, storeID may be wrong",
          error: e,
          controller: "getStoreData",
        });
      }
    } else {
      res
        .status(400)
        .json({ error: "There is no storeID parameter in the url to process" });
    }
  },
  createStore: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const user = req.user as UserInterface;
      const sameAddress = await Store.findOne({
        address: data.address,
        state: data.state,
      });
      if (sameAddress) {
        res.status(403).json({ error: "Error: Address & State is same" });
      } else {
        const storeData = new Store({
          address: data.address,
          name: data.name,
          state: data.state,
        });
        const newStore: storeInterface = await Store.create(storeData);
        const userData = await User.findById(user._id);
        userData?.store.push(newStore._id);
        await userData?.save();
        res.json({
          message: "created store, updated Data",
          results: newStore,
        });
      }
    } catch (e) {
      res
        .status(401)
        .json({ error: e, message: "fail to create store and add to user" });
    }
  },
};

export const validateStoreData = {
  body: Joi.object({
    name: Joi.string().required(),
    address: Joi.string()
      .regex(/[a-zA-Z0-9]{3}/)
      .required(),
    state: Joi.string()
      .regex(/[a-zA-Z]{3}/)
      .required(),
  }),
};
