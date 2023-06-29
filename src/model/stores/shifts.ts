import { Schema, model, Document } from "mongoose";
const shiftSchema = new Schema({
  // name: { type: String },
  date: { type: Date },
  section: { type: Number },
  // waiters: [{ type: Schema.Types.ObjectId, ref: "Waiters" }],
  shiftNumber: { type: Number }, //for Grouping
  activeTables: [{ type: Schema.Types.ObjectId, ref: "Party" }],
  // store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  dailyData: { type: Schema.Types.ObjectId, ref: "DailyData" },
});

export default model("Shift", shiftSchema);
