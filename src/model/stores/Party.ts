import { check } from "express-validator";
import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";
interface partyInterface {
  name: string;
  partySize: number;
  phoneNumber: string;
  reservationDate: Date;
  reservationDateTime: Date;
  timeData: {
    checkInTime: Date;
    startDining: { time: Date; isEntreeOnTable: boolean };
    finishedTime: Date;
    waitingTime: string;
  };
  status: string;
  store: ObjectId;
}
const partySchema: Schema<partyInterface> = new Schema<partyInterface>({
  name: { type: String },
  partySize: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  reservationDate: { type: Date },
  reservationDateTime: { type: Date },
  timeData: {
    checkInTime: { type: Date },
    startDining: { time: { type: Date }, isEntreeOnTable: { type: Boolean } },
    finishedTime: { type: Date },
    waitingTime: { type: String },
  },
  status: {
    type: String,
    enum: ["Active", "Finished", "Canceled"],
    default: "Active",
  },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  // finished: { type: Boolean },
});
partySchema.pre("save", function (next) {
  if (this.timeData?.checkInTime && this.timeData?.startDining?.time) {
    const checkInTime = this.timeData.checkInTime.getTime();
    const startDiningTime = this.timeData.startDining.time.getTime();

    if (startDiningTime <= checkInTime) {
      const err = new Error("startDining time must be after checkInTime");
      return next(err);
    }
  }

  // Call the next middleware
  next();
});
partySchema.pre("save", function (next) {
  const checkInTime = this.timeData?.checkInTime;
  const startDining = this.timeData?.startDining?.time;
  if (checkInTime && startDining) {
    const timeDifferenceMS = startDining.getTime() - checkInTime.getTime();
    const hour = Math.floor(timeDifferenceMS / 1000 / 60 / 24);
    const minutes = Math.floor(timeDifferenceMS / 1000 / 60) % 60;
    const seconds = Math.floor(timeDifferenceMS / 1000) % 60;
    this.timeData.waitingTime = `${hour}:${minutes}:${seconds}`;
  }
  next();
});

export default model("Party", partySchema);
