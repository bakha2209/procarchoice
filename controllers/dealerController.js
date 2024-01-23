const Member = require("../models/Member");
const Car = require("../models/Car")
const Definer = require("../lib/mistake");
const assert = require("assert");

let dealerController = module.exports;

dealerController.home = (req, res) => {
  try {
    console.log('GET: cont/home');
    res.render("home-page");
  } catch(err) {
    console.log(`ERROR, cont/home, ${err.message}`)
    res.json({state: 'fail', message: err.message})
  }
}

dealerController.getMyDealerCars = async (req, res) => {
  try {
    console.log(`GET: cont/getMyDealerCars`)
    const car = new Car();
    const data = await car.getAllCarsDataDealer(res.locals.member)
    res.render("dealer-menu", {dealer_data: data});
  } catch (err) {
    console.log(`ERROR, cont/getMyDealerCars, ${err.message}`);
    res.redirect("/resto");
  }
};

dealerController.getSignupMyDealer = async (req, res) => {
  try {
    console.log(`GET: cont/getSignupMyDealer`);
    res.render("signup");
  } catch (err) {
    console.log(`ERROR, cont/getSignupMyDealer, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.signupProcess = async (req, res) => {
  try {
    console.log(`POST: cont/signup`);
    assert.ok(req.file, Definer.general_err3)
    
    let new_member = req.body;
    new_member.mb_type = "DEALER";
    new_member.mb_image = req.file.path.replace(/\\/g, '/');;

    const member = new Member();
    const result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1)

    req.session.member = result;
    res.redirect("/resto/cars/menu");
  } catch (err) {
    console.log(`ERROR, cont/signup, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.getLoginMyDealer = async (req, res) => {
  try {
    console.log(`GET: cont/getLoginMyDealer`);
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, cont/getLoginMyDealer, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.loginProcess = async (req, res) => {
  try {
    console.log(`POST: cont/loginProcess`);
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);
    req.session.member = result;
    req.session.save(function () {
      result.mb_type === "ADMIN"
        ? res.redirect("/resto/all-dealer")
        : res.redirect("/resto/cars/menu");
    });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.logout = (req, res) => {
  try {
    console.log("GET cont/logout");
    req.session.destroy(function () {
      res.redirect("/resto");
    });
  } catch (err) {
    console.log(`ERROR, cont/logout, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.validateAuthDealer = (req, res, next) => {
  console.log("checking:",req.session?.member)
  if (req.session?.member?.mb_type === "DEALER") {
    req.member = req.session.member;
    next();
  } else
    res.json({
      state: "fail",
      message: "only authenticated members with dealer type",
    });
};

dealerController.checkSessions = (req, res) => {
  console.log("sessions:", req.session?.member)
  if (req.session?.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};
