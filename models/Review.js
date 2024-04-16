const ReviewModel = require("../schema/review_model");
const MemberModel = require("../schema/member_model");
const CarModel = require("../schema/car_model");
const BoArticleModel = require("../schema/bo_article.model");
const Definer = require("../lib/mistake");

class Review {
  constructor(mb_id) {
    this.reviewModel = ReviewModel;
    this.memberModel = MemberModel;
    this.carModel = CarModel;
    this.boArticleModel = BoArticleModel;
    this.mb_id = mb_id;
  }

  async validateTargetItem(id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({
              _id: id,
              mb_status: "ACTIVE",
            })
            .exec();
          break;
        case "car":
          result = await this.carModel
            .findOne({
              _id: id,
              car_status: "PROCESS",
            })
            .exec();
          break;
        case "community":
          result = await this.boArticleModel
            .findOne({
              _id: id,
              art_status: "active",
            })
            .exec();
          break;
      }

      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async insertMemberReview(review_ref_id, group_type, review, rating) {
    try {
      const new_review = new this.reviewModel({
        mb_id: this.mb_id,
        review_ref_id: review_ref_id,
        review_group: group_type,
        review_content: review,
        rating: rating,
      });
      const result = await new_review.save();

      //Modify target likes count
      await this.modifyItemReviews(review_ref_id, group_type, review, rating);
      return result;
    } catch (err) {
      throw new Error(Definer.mongo_validation_err1);
    }
  }

  async modifyItemReviews(review_ref_id, group_type, review, rating) {
    try {
      switch (group_type) {
        case "member":
          await this.memberModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              { $inc: { mb_rating: rating }, $push: { mb_reviews: review } }
            )
            .exec();
          break;
        case "car":
          await this.carModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              { $inc: { car_rating: rating }, $push: { car_reviews: review } }
            )
            .exec();
          break;
        case "community":
          await this.boArticleModel
            .findByIdAndUpdate(
              {
                _id: review_ref_id,
              },
              { $inc: { art_rating: rating }, $push: { art_reviews: review } }
            )
            .exec();
          break;
      }

      return true;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Review;
