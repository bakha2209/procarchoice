const express = require("express");
const router_bssr = express.Router();
const dealerController = require("./controllers/dealerController");
const carController = require("./controllers/carController");
const eventController = require("./controllers/eventContoller")
const uploader_car = require("./utils/upload-multer")("cars");
const uploader_members = require("./utils/upload-multer")("members");
const uploader_events = require("./utils/upload-multer")("events");

/********************************
 *      BSSR EJS                *
 *********************************/

//memberga dahldor routerlar

router_bssr.get("/", dealerController.home);

router_bssr.get("/sign-up", dealerController.getSignupMyDealer);
router_bssr.post(
  "/sign-up",
  uploader_members.single("dealer_img"),

  dealerController.signupProcess
);

router_bssr.get("/login", dealerController.getLoginMyDealer);
router_bssr.post("/login", dealerController.loginProcess);

router_bssr.get("/logout", dealerController.logout);
router_bssr.get("/check-me", dealerController.checkSessions);

router_bssr.get("/cars/menu", dealerController.getMyDealerCars);
router_bssr.post(
  "/cars/create",
  dealerController.validateAuthDealer,

  uploader_car.array("car_images", 5),
  carController.addNewCar
);
router_bssr.post(
  "/events/create",
  dealerController.validateAuthDealer,
  uploader_events.single("event_image"),
  dealerController.addNewEvent
);
router_bssr.post(
  "/events/edit/:id",
  dealerController.validateAuthDealer,
  eventController.updateChosenEvent
);
// router_bssr.get("/events/menu", dealerController.getMyDealerEvents);
router_bssr.post(
  "/cars/edit/:id",
  dealerController.validateAuthDealer,
  carController.updateChosenCar
);

router_bssr.get(
  "/all-dealer",
  dealerController.validateAdmin,
  dealerController.getAllDealers
);

router_bssr.post(
  "/all-dealer/edit",
  dealerController.validateAdmin,
  dealerController.updateDealerByAdmin
);

module.exports = router_bssr;
