const EventModel = require("../schema/event_model");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const assert = require("assert");
const Definer = require("../lib/mistake");

class Event {
  constructor() {
    this.eventModel = EventModel;
  }

  async addNewEventData(data, member) {
    try {
      data.dealer_mb_id = shapeIntoMongooseObjectId(member._id);
      console.log(data);

      const new_event = new this.eventModel(data);
      const result = await new_event.save();

      assert.ok(result, Definer.car_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllEventsData(data) {
    try {
      let match = { event_status: "PROCESS" };
      const sort = { [data.order]: -1 };

      const result = await this.eventModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
        ])
        .exec();
        console.log("result", result)
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async getAllEventsDataResto(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.eventModel.find({
        dealer_mb_id: member._id,
      });

      assert.ok(result, Definer.general_err1);
      console.log("result:", result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateChosenEventData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);

      const result = await this.eventModel
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

module.exports = Event;
