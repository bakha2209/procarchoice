const CarModel = require("../schema/car_model");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const Member = require("./Member");

class Car {
  constructor() {
    this.carModel = CarModel;
  }

  async getAllCarsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      let match = { car_status: "PROCESS" };
      // if (data.dealer_mb_id) {
      //   match["dealer_mb_id"] = shapeIntoMongooseObjectId(
      //     data.dealer_mb_id
      //   );
      //   match["product_collection"] = data.product_collection;
      // }

      const sort =
        data.order === "car_price" ? { [data.order]: 1 } : { [data.order]: -1 };

      const result = await this.carModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
        ])
        .exec();

      console.log(result);
      //todo: check auth member product likes

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenCarData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if(member) {
        const member_obj = new Member();
        member_obj.viewChosenItemByMember(member, id, "car")
      }

      const result = await this.carModel
        .aggregate([{ $match: { _id: id, car_status: "PROCESS" } }])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result
    } catch (err) {
      throw err;
    }
  }

  async getAllCarsDataDealer(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.carModel.find({
        dealer_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      //console.log("result:", result)
      return result;
    } catch (err) {
      throw err;
    }
  }
  async addNewCarData(data, member) {
    try {
      data.dealer_mb_id = shapeIntoMongooseObjectId(member._id);
      console.log(data);

      const new_car = new this.carModel(data);
      const result = await new_car.save();

      assert.ok(result, Definer.car_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenCarData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);

      const result = await this.carModel
        .findOneAndUpdate({ _id: id, dealer_mb_id: mb_id }, updated_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Car;
