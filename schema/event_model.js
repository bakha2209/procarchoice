const mongoose = require("mongoose");

const { car_status_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const eventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
    },
    event_date: {
      type: String,
      required: false,
    },
    event_content: {
      type: String,
      required: true,
    },
    event_address: {
      type: String,
      required: false,
    },
    event_image: {
      type: String,
      required: false,
    },
    event_status: {
      type: String,
      required: false,
      default: "PROCESS",
      enum: {
        values: car_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    mb_id: { type: Schema.Types.ObjectId, ref: "Member", required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", eventSchema);
