import mongoose, { mongo } from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const transactionSchema = new Schema({
  borrower: {
    type: String,
    required: true
  },
  lender: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  totalprice: {
    type: Number,
    required: true
  },
  distancetravelled: {
    type: Number,
    required: true
  },
  vechile: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle"
  },
  
})

export default mongoose.model("Transaction", transactionSchema)