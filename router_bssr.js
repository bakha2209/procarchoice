const express = require("express");
const router_bssr = express.Router();
const dealerController = require("./controllers/dealerController");

/********************************
 *      BSSR EJS                *
 *********************************/

//memberga dahldor routerlar

router_bssr.get("/sign-up", dealerController.getSignupMyDealer);
router_bssr.post("/sign-up", dealerController.signupProcess);

router_bssr.get("/login", dealerController.getLoginMyDealer);
router_bssr.post("/login", dealerController.loginProcess);

router_bssr.get("/logout", dealerController.logout);
router_bssr.get("/check-me", dealerController.checkSessions);

router_bssr.get("/cars/menu", dealerController.getMyDealerData);

module.exports = router_bssr;
