const CarModel = require("../schema/car_model");
const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
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
      if (data.dealer_mb_id) {
        match["dealer_mb_id"] = shapeIntoMongooseObjectId(data.dealer_mb_id);
      }
      if (data.car_brand) {
        match["car_brand"] = data.car_brand;
      }
      if (data.car_color) {
        match["car_color"] = data.car_color;
      }
      if (data.car_type) {
        match["car_type"] = data.car_type;
      }
      if (data.car_engine_type) {
        match["car_engine_type"] = data.car_engine_type;
      }
      if (data.car_transmission) {
        match["car_transmission"] = data.car_transmission;
      }
      if (data.produced_year) {
        match["produced_year"] = { $gte: data.produced_year };
      }
      if (data.car_price) {
        match["car_price"] = { $gte: data.car_price };
      }
      const sort = { [data.order]: -1 }; //elementni dynamic qiymati uchun

      const result = await this.carModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          lookup_auth_member_liked(auth_mb_id),
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
  async getAllCarsCategoriesData(member, data) {
    const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
    const limit = parseInt(data.limit)
      const page = parseInt(data.page);
    try {
      let match = { car_status: "PROCESS" };
      if (data.car_brand) {
        match["car_brand"] = data.car_brand;
      } else if (data.car_type) {
        match["car_type"] = data.car_type;
      }
      const sort = { [data.order]: -1 };
      const result = await this.carModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: parseInt((page - 1) * limit) },
          { $limit: limit },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();
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

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "car");
      }

      const result = await this.carModel
        .aggregate([
          { $match: { _id: id, car_status: "PROCESS" } },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);
      return result[0];
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
