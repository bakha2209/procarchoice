const express = require("express");
const router = express.Router();
const memberController =require("./controllers/memberController");
const carController = require("./controllers/carController");
const dealerController = require("./controllers/dealerController");

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



module.exports = router