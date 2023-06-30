import { NextFunction, Request, Response } from "express";
// import User from "../model/User";
import { genPassword } from "../passport";
// const validPassword = require("../").validPassword;

import { Joi } from "express-validation";

import Store, { storeInterface } from "../model/stores/Store";
import User, { UserInterface } from "../model/User";

export const storecontroller = {
  getStores: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as UserInterface;
      // const sessionID = req.?sessionID;

      res.json({ user: user._id, store: user.store });
    } catch (e) {
      res
        .status(400)
        .json({ message: "failed to get store from user", error: e });
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
          newStore: newStore,
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
