const mongoose = require("mongoose");


exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "DEALER"];
exports.member_status_enums= ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordinary_enums = ["Y","N"];
exports.car_brand_enums = ["BMW",'AUDI',"FORD","MERCEDES-BENZ","KIA","HYUNDAI","SAMSUNG","VOLVO","DAF","MAN","CHEVROLET" ];
exports.car_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.car_engine_enums = ["gasoline","dizel","gas","electric","hybrid"];
exports.car_type_enums = ["CONVERTIBLE","SUV","PICKUP","STATION WAGON","SUPERCAR","ROADSTER",
"COUPE","SEDAN","CROSSOVER","MPV","LIMOUSINE","4x4","HATCHBACK","SPORTS CAR","MINIVAN","CITY CAR"];
exports.car_color_enums = ["white","black","red","yellow","green","blue","grey"]

exports.like_view_group_list = ['car', 'member', 'community'];
exports.board_id_enum_list = ['celebrity', 'evaluation','story']


/**********************
 *  MONGODB RELATED COMMANDS
 ***********************/

exports.shapeIntoMongooseObjectId = (target) => {
    if (typeof target === 'string') {
      return new mongoose.Types.ObjectId(target);
    } else return target;
  }