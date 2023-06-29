import { Schema, model, Document } from "mongoose";

const partySchema = new Schema({
  name: { type: String },
  partySize: { type: Number, required: true },
  phoneNumber: { type: Number, required: true },
  reservationDate: { type: Date },
  timeData: {
    checkInTime: { type: Date },
    startDining: { time: { type: Date }, isEntreeOnTable: { type: Boolean } },
    finishedTime: { type: Date },
    waitingTime: { type: Date },
  },
  status: {
    type: String,
    enum: ["active", "finished", "canceled"],
    default: "active",
  },
  store: { type: Schema.Types.ObjectId, ref: "Store" },
  // finished: { type: Boolean },
});

// partySchema.pre("save", function (next) {
//   if (this.checkInTime) {
//     this.waitingTime = new Date(
//       this.checkInTime.getTime() - new Date().getTime()
//     );
//   }
//   next();
// });

export default model("Party", partySchema);
