const mongoose = require("mongoose");

const { order_status_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const orderItemSchema = new mongoose.Schema(
  {
    item_quantity: { type: Number, required: true },
    item_price: { type: Number, required: true },
    item_discount:{ type: Number, required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: false },
    car_id: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderItem", orderItemSchema);
