const express = require("express");
const router = express.Router();
const memberController = require("./controllers/memberController");
const carController = require("./controllers/carController");
const dealerController = require("./controllers/dealerController");
const orderController = require("./controllers/orderController");
const communityController = require("./controllers/communityController");
const uploader_member = require("./utils/upload-multer")("members");
const uploader_community = require("./utils/upload-multer")("community");
const followController = require("./controllers/followController");

/********************************
 *      REST API                *
 *********************************/

//memberga dahldor routerlar

router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);
router.post(
  "/member-liken",
  memberController.retrieveAuthMember,
  memberController.likeMemberChosen
);

//Car related routers
router.post(
  "/cars",
  memberController.retrieveAuthMember,
  carController.getAllCars
);
router.get(
  "/cars/:id",
  memberController.retrieveAuthMember,
  carController.getChosenCar
);

//Dealer related routers
router.get(
  "/dealers",
  memberController.retrieveAuthMember,
  dealerController.getDealers
);
router.get(
  "/dealers/:id",
  memberController.retrieveAuthMember,
  dealerController.getChosenDealer
);

//order related routers
router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);
router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);
router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);

//community related routers
router.post(
  "/community/image",
  uploader_community.single("community_image"),
  communityController.imageInsertion
);
router.post(
  "/community/create",
  memberController.retrieveAuthMember,
  communityController.createArticle
);
router.get(
  "/community/articles",
  memberController.retrieveAuthMember,
  communityController.getMemberArticles
);
router.get(
  "/community/target",
  memberController.retrieveAuthMember,
  communityController.getArticles
);
router.get(
  "/community/single-article/:art_id",
  memberController.retrieveAuthMember,
  communityController.getChosenArticle
);
//following related routers
router.post(
  "/follow/subscribe",
  memberController.retrieveAuthMember,
  followController.subscribe
);
router.post(
  "/follow/unsubscribe",
  memberController.retrieveAuthMember,
  followController.unsubscribe
);
router.get("/follow/followings", followController.getMemberFollowings);
router.get(
  "/follow/followers",
  memberController.retrieveAuthMember,
  followController.getMemberFollowers
);

module.exports = router;
