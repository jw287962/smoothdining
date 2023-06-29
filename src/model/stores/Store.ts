import { Schema, model, Document } from "mongoose";
const storeSchema = new Schema({
  address: { type: String },
  name: { type: String },
  // waiters: [{ type: Schema.Types.ObjectId, ref: "Waiters" }],
});

export default model("Store", storeSchema);
