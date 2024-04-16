const mongoose = require("mongoose");
const {
  car_brand_enums,
  car_engine_enums,
  car_type_enums,
  car_status_enums,
  car_color_enums,
  car_transmission_enums,
} = require("../lib/config");
const Schema = mongoose.Schema;
const carSchema = new mongoose.Schema(
  {
    car_name: { type: String, required: true },
    car_brand: {
      type: String,
      required: true,
      enum: {
        values: car_brand_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    car_model: {
      type: String,
      required: true,
    },
    car_engine_type: {
      type: String,
      required: false,
      default: "gasoline",
      enum: {
        values: car_engine_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    car_type: {
      type: String,
      required: false,
      enum: {
        values: car_type_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    car_color: {
      type: String,
      required: true,
      enum: {
        values: car_color_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    car_status: {
      type: String,
      required: false,
      default: "PROCESS",
      enum: {
        values: car_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    car_price: {
      type: Number,
      required: true,
    },
    car_discount: {
      type: Number,
      required: false,
      default: 0,
    },
    car_left_cnt: {
      type: Number,
      required: true,
    },
    car_transmission: {
      type: String,
      required: true,
      default: "AUTOMATIC",
      enum: {
        values: car_transmission_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    petrol_consumption: {
      type:Number,
      required:true
    },
    acceleration: {
      type:Number,
      required: true
    },
    produced_year: {
      type:Number,
      required:true
    },
    car_description: { type: String, required: true },
    car_images: { type: Array, required: false, default: [] },
    car_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    car_views: {
      type: Number,
      required: false,
      default: 0,
    },
    car_reviews: {
      type: Array,
      required: false,
      default: []
    },
    car_rating: {
      type: Number,
      required: false,
      default:0
    },
    dealer_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
); //createdAt, updatedAt

carSchema.index(
  { dealer_mb_id: 1, car_name: 1, car_model: 1, car_color: 1, car_price: 1 },
  { unique: true }
);

module.exports = mongoose.model("Car", carSchema);
