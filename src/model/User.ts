import { Schema, model, Document } from "mongoose";


const userSchema = new Schema({
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
});

// comments should hold an array of comment.js Models

// CategorySchema.virtual('URL').get(function() {
//   return `/inventory/category/${this._id}`
// });

export default model("User", userSchema);
