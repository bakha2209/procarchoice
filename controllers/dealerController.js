const Member = require("../models/Member");
const Car = require("../models/Car");
const Definer = require("../lib/mistake");
const assert = require("assert");
const Dealer = require("../models/Dealer");
const Event = require("../models/Event");

let dealerController = module.exports;

dealerController.getDealers = async (req, res) => {
  try {
    console.log("GET: cont/getDealers");
    const data = req.query;
    const dealer = new Dealer();
    const result = await dealer.getDealersData(req.member, data);
    //console.log("result:::", result)
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getDealers, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.getChosenDealer = async (req, res) => {
  try {
    console.log("GET: cont/getChosenDealer");
    const id = req.params.id;
    const dealer = new Dealer();
    const result = await dealer.getChosenDealerData(req.member, id);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenDealer, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/****************************************
 * BSSR RELATED METHODS
 ****************************************/

dealerController.home = (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, cont/home, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.getMyDealerCars = async (req, res) => {
  try {
    console.log(`GET: cont/getMyDealerCars`);
    const car = new Car();
    const data = await car.getAllCarsDataDealer(res.locals.member);

    const event = new Event();
    const result = await event.getAllEventsDataResto(res.locals.member);
    res.render("dealer-menu", { dealer_data: data, event_data: result });
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
    assert.ok(req.file, Definer.general_err3);

    let new_member = req.body;
    new_member.mb_type = "DEALER";
    new_member.mb_image = req.file.path.replace(/\\/g, "/");

    const member = new Member();
    const result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1);

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
dealerController.addNewEvent = async (req, res) => {
  try {
    console.log("POST cont/addNewEvent");
    const data = req.body;
    assert(req.file, Definer.general_err3);
    data.event_image = req.file.path.replace(/\\/g, "/");
    
    const member = new Event();
    const result = await member.addNewEventData(data, req.member);

    const html = `<script>
                     alert('new event added successfully');
                     
                   </script>`;
    res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/AddNewEvent, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
// dealerController.getMyDealerEvents = async (req, res) => {
//   try {
//     console.log("GET cont/getMyDealerEvents");
//     const event = new Event()
//     const data = await event.getAllEventsDataResto(res.locals.member);
//     console.log(res.locals.member)
//     res.render("dealer-menu", { event_data: data });
//   } catch(err) {
//     console.log(`ERROR, cont/getMyDealerEvents, ${err.message}`);
//     res.json({ state: "fail", message: err.message });
//   }
// }
dealerController.validateAuthDealer = (req, res, next) => {
  console.log("checking:", req.session?.member);
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
  console.log("sessions:", req.session?.member);
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};

dealerController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script>
                   alert('Admin page: Permission denied')
                   window.location.replace('/resto')
                 </script>`;
    res.end(html);
  }
};

dealerController.getAllDealers = async (req, res) => {
  try {
    console.log("GET: cont/getAllDealers");
    const dealer = new Dealer();
    const dealers_data = await dealer.getAllDealersData();
    console.log("dealers_data:", dealers_data);
    res.render("all-dealers", { dealers_data: dealers_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllDealers, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

dealerController.updateDealerByAdmin = async (req, res) => {
  try {
    console.log("GET: cont/updateDealerByAdmin");

    const dealer = new Dealer();
    const result = await dealer.updateDealerByAdminData(req.body);
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateDealerByAdmin, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
