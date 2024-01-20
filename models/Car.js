const CarModel = require("../schema/car_model");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer =  require("../lib/mistake");



 class Car {
    constructor() {
        this.carModel = CarModel;
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

        } catch(err) {
          throw err;
      }
    }

    async updateChosenCarData(id, updated_data,mb_id) {
      try {
        id = shapeIntoMongooseObjectId(id);
        mb_id = shapeIntoMongooseObjectId(mb_id);

        const result = await this.carModel.findOneAndUpdate(
          {_id: id,dealer_mb_id:mb_id},
          updated_data,
          {
            runValidators: true,
            lean: true, 
            returnDocument: "after",
          })
        .exec();

        assert.ok(result, Definer.general_err1);
        return result;
        } catch(err) {
        throw err;
    }
  }
 }
 module.exports = Car;