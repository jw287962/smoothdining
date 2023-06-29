import { Schema, model, Document } from "mongoose";
import { Db } from "mongodb";

const shiftSchema = new Schema({
  // name: { type: String },
  date: {
    type: Date,
    set: function (value: Date) {
      if (value instanceof Date) {
        // Set the time portion to 00:00:00
        value.setHours(0, 0, 0, 0);
        return value;
      }
      return value;
    },
    get: function (value: Date) {
      if (value instanceof Date) {
        // Return the date without the time portion
        return value.toISOString().split("T")[0];
      }
      return value;
    },
    required: true,
  },
  section: { type: Number, required: true },
  waiters: { type: Schema.Types.ObjectId, ref: "Waiters" },
  shiftNumber: { type: Number }, //for Grouping
  shiftTables: [{ type: Schema.Types.ObjectId, ref: "Party" }],
  // store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  // dailyData: { type: Schema.Types.ObjectId, ref: "DailyData" },
  lastPartyTaken: { type: Date },
});

shiftSchema.pre("save", async function (next) {
  const existingShift = await this.collection.findOne({
    date: this.date,
    section: this.section,
  });
  if (existingShift) {
    const err = new Error(`${this.section} is already taken`);
    next(err);
  } else {
    next();
  }
});
export default model("Shift", shiftSchema);
