const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const OrderModel = require("../schema/order_model");
const OrderItemModel = require("../schema/order_Item.model");

class Order {
  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
  }

  async createOrderData(member, data) {
    try {
      let order_total_amount = 0;

      const mb_id = shapeIntoMongooseObjectId(member._id);

      data.map((item) => {
        order_total_amount += item["quantity"] * (item["price"] - (item["price"]*item["discount"]/100));
      });

      const order_id = await this.saveOrderData(order_total_amount, mb_id);
      console.log("order_id:::", order_id);
      //order items creation
      await this.recordOrderItemsData(order_id, data);
      return order_id;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderData(order_total_amount, mb_id) {
    try {
      const new_order = new this.orderModel({
        order_total_amount: order_total_amount,
        mb_id: mb_id,
      });
      const result = await new_order.save();
      assert.ok(result, Definer.order_err1);

      return result._id;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err1);
    }
  }

  async recordOrderItemsData(order_id, data) {
    try {
      const pro_list = data.map(async (item) => {
        return await this.saveOrderItemsData(item, order_id);
      });

      const results = await Promise.all(pro_list);
      console.log("results:::", results);
      return true;
    } catch (err) {
      throw err;
    }
  }

  async saveOrderItemsData(item, order_id) {
    try {
      order_id = shapeIntoMongooseObjectId(order_id);
      item._id = shapeIntoMongooseObjectId(item._id);

      const order_item = new this.orderItemModel({
        item_quantity: item["quantity"],
        item_price: item["price"],
        item_discount:item["discount"],
        order_id: order_id,
        car_id: item["_id"],
      });
      const result = await order_item.save();
      assert.ok(result, Definer.order_err2);
      return "created";
    } catch (err) {
      console.log(err);
      throw new Error(Definer.order_err2);
    }
  }

  async getMyOrdersData(member, query) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_status = query.status.toUpperCase(),
        matches = { mb_id: mb_id, order_status: order_status };

      const result = await this.orderModel
        .aggregate([
          { $match: matches },
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "orderitems",
              localField: "_id",
              foreignField: "order_id",
              as: "order_items",
            },
          },
          {
            $lookup: {
              from: "cars",
              localField: "order_items.car_id",
              foreignField: "_id",
              as: "car_data",
            },
          },
        ])
        .exec();
      console.log("req.query:", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async editChosenOrderData(member, data) {
    try {
      const mb_id = shapeIntoMongooseObjectId(member._id),
        order_id = shapeIntoMongooseObjectId(data.order_id),
        order_status = data.order_status.toUpperCase();

      const result = await this.orderModel.findOneAndUpdate(
        { mb_id: mb_id, _id: order_id },
        { order_status: order_status },
        { runValidators: true, lean: true, returnDocument: "after" }
      );
      console.log(result);

      assert.ok(result, Definer.order_err3);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Order;
