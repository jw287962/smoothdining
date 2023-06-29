import { Schema, model, Document } from "mongoose";
const waiterSchema = new Schema({
  name: { type: String, required: true },
  birthdate: { type: Date },
  // section: { type: Number },
  // workers: [{ type: Schema.Types.ObjectId, ref: "Waiters" }],
  // shifts: [{ type: Schema.Types.ObjectId, ref: "Shift" }],
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
});

export default model("Waiter", waiterSchema);
