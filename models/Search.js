const CarModel = require("../schema/car_model");
const assert = require("assert");
const Definer = require("../lib/mistake");

class Search {
  constructor() {
    this.carModel = CarModel;
  }
  async getSearchCarsData(member, inquery) {
    try {
      const search = inquery.toLowerCase();
      const result = await this.carModel.find({
        $or: [
            { car_name: { $regex: search, $options: 'i' } },
            { car_brand: { $regex: search, $options: 'i' } },
            { car_model: { $regex: search, $options: 'i' } }
        ]
      });
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Search;
