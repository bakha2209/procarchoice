const mongoose = require("mongoose");


exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "DEALER"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordinary_enums = ["Y", "N"];
exports.car_brand_enums = [
  "BMW",
  "AUDI",
  "FORD",
  "MERCEDES-BENZ",
  "KIA",
  "HYUNDAI",
  "SAMSUNG",
  "VOLVO",
  "DAF",
  "MAN",
  "CHEVROLET",
];
exports.car_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.car_engine_enums = ["gasoline", "diesel", "gas", "electric", "hybrid"];
exports.car_type_enums = [
  "CONVERTIBLE",
  "SUV",
  "PICKUP",
  "STATION WAGON",
  "SUPERCAR",
  "ROADSTER",
  "COUPE",
  "SEDAN",
  "CROSSOVER",
  "MPV",
  "LIMOUSINE",
  "4x4",
  "HATCHBACK",
  "SPORTS CAR",
  "MINIVAN",
  "CITY CAR",
];
exports.car_color_enums = [
  "white",
  "black",
  "red",
  "yellow",
  "green",
  "blue",
  "gray",
];
exports.car_transmission_enums =["AUTOMATIC", "MANUAL"]

exports.like_view_group_list = ["car", "member", "community"];
exports.board_id_enum_list = ["celebrity", "evaluation", "story"];
exports.board_article_status_enum_list = ["active", "deleted"];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

/**********************
 *  MONGODB RELATED COMMANDS
 ***********************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};

exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id"
  return {
    $lookup: {
      from: "follows",
      let: {
        lc_follow_id: follow_id,
        lc_subscriber_id: mb_id,
        me_my_following: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$lc_follow_id"] },
                { $eq: ["$subscriber_id", "$$lc_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$me_my_following"
          },
        },
      ],
      as: "me_followed"
    },
  };
};

exports.lookup_auth_member_liked = (mb_id) => {
  
  return {
    $lookup: {
      from: "likes",
      let: {
        lc_liken_item_id: "$_id",
        lc_mb_id: mb_id,
        me_my_favorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_ref_id", "$$lc_liken_item_id"] },
                { $eq: ["$mb_id", "$$lc_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$me_my_favorite"
          },
        },
      ],
      as: "me_liked"
    },
  };
};
