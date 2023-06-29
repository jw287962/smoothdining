import { Schema, model, Document } from "mongoose";
export interface UserInterface {
  signUpDate: Date;
  // title: { type: String },
  google?: {
    id?: string;
    name?: string;
    email?: string;
  };
  username: string;
  salt: string;
  hash: string;
  store: Schema.Types.ObjectId[];
  role: string;
  _id: Schema.Types.ObjectId;
}
const userSchema: Schema<UserInterface> = new Schema<UserInterface>({
  signUpDate: { type: Date, required: true },
  // title: { type: String },
  google: {
    id: { type: String },
    name: { type: String },
    email: { type: String },
  },
  username: { type: String, required: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  store: [{ type: Schema.Types.ObjectId, ref: "Store" }],
  role: {
    type: String,
    enum: ["Owner", "Worker", "Customer"],
    default: "Owner",
  },
});

// comments should hold an array of comment.js Models

// CategorySchema.virtual('URL').get(function() {
//   return `/inventory/category/${this._id}`
// });

export default model("User", userSchema);
