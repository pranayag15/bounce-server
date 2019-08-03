import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  occupation: {
    type: String,
    required: true
  },
  vehicles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Vehicle"
    }
  ],
  lending: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }
  ],
  borrowing: [
    {
      type: Schema.Types.ObjectId,
      ref: "Transaction"
    }
  ]
});

export default mongoose.model("User", UserSchema);
