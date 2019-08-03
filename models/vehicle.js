import mongoose from "mongoose";
import { ObjectID } from "mongodb";
import { resolveSrv } from "dns";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function () {
  return this.toString();
};

const vehicleSchema = new Schema({
  type: {                 //2 wheeler or 4 wheeler
    type: String,
    required: true
  },
  image: [
    {
      type: String,
      required: true
    }
  ],
  manufacturer: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  transmission: {
    type: String,
    required: true
  },
  fueltype: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  odometer: {
    type: Number
  },
  price: {
    type: Number,
    // required: true,
    // default: 0
  },
  location: {
    type: String,
    // required: true
  },
  islive: {
    type: Boolean,
    required: true,
    default: false
  },
  isrented: {
    type: Boolean,
    default: false
  },
  // pickupTime: {
  //   type: String,
  //   default: new Date().toISOString()
  // },
  // dropTime: {
  //   type: Object,
  //   default: () => {
  //     var date = new Date();
  //     date.setDate(date.getDate() + 5);
  //     var isodate = date.toISOString();
  //     return isodate
  //   }
  // },
  pickup: {
    type: Object
  },
  drop: {
    type: Object
  },
  perkm: {
    type: Number
  },
  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  },
  availabilityDate: {
    type: Date,
    default: new Date().toISOString()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }


})

export default mongoose.model("Vehicle", vehicleSchema);