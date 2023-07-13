import { ObjectId } from "mongodb";
import { Schema, model, Document } from "mongoose";
export interface waiterInterface {
  name: string;
  birthdate: Date;
  preferences?: {
    maxActiveTableForPermission: number;
    waitToSitUntilEntreeOut: { min: number };
  };
  store: ObjectId;
  status: Boolean;
}

const waiterSchema: Schema<waiterInterface> = new Schema<waiterInterface>({
  name: { type: String, required: true },
  birthdate: { type: Date },
  preferences: {
    maxActiveTableForPermission: { type: Number },
    waitToSitUntilEntreeOut: { min: { type: Number } },
  },
  // section: { type: Number },
  // workers: [{ type: Schema.Types.ObjectId, ref: "Waiters" }],
  // shifts: [{ type: Schema.Types.ObjectId, ref: "Shift" }],
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  status: { type: Boolean, required: true, default: true },
});

export default model("Waiter", waiterSchema);
