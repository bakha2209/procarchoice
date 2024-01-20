const Member = require("../models/Member");

let dealerController = module.exports;

dealerController.getMyDealerData = async (req, res) => {
  try {
    console.log(`GET: cont/getMyDealerData`);
    //TODO: Get my dealer cars

    res.render("dealer-menu");
  } catch (err) {
    console.log(`ERROR, cont/getMyDealerData, ${err.message}`);
    res.json({ state: "fail", message: err.message });
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
    const data = req.body,
      member = new Member(),
      new_member = await member.signupData(data);
    req.session.member = new_member;
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
      res.redirect("/resto/cars/menu");
    });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("logout sahifasidasiz");
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
