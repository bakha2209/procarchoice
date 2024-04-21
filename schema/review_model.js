const mongoose = require("mongoose");
const { like_view_group_list, board_article_status_enum_list } = require("../lib/config");
const Schema = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    mb_id: { type: Schema.Types.ObjectId, ref: "Member",required: true },
    review_ref_id: { type: Schema.Types.ObjectId, required: true },
    review_status: {
        type: String,
        required: false,
        default: "active",
        enum: {
          values: board_article_status_enum_list,
          message: "{VALUE} is not among permitted values",
        },
      },
    review_group: {
      type: String,
      required: true,
      enum: { values: like_view_group_list },
      message: "{VALUE} is not among permitted values",
    },
    review_content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Review", reviewSchema);
