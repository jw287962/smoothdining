import { Schema, model, Document } from "mongoose";

const partySchema = new Schema({
  name: { type: String },
  partySize: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  reservationDate: { type: Date },
  timeData: {
    checkInTime: { type: Date },
    startDining: { time: { type: Date }, isEntreeOnTable: { type: Boolean } },
    finishedTime: { type: Date },
    waitingTime: { type: Date },
  },
  status: {
    type: String,
    enum: ["Active", "Finished", "Canceled"],
    default: "Active",
  },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  // finished: { type: Boolean },
});

export default model("Party", partySchema);
