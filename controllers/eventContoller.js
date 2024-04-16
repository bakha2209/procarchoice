const Event = require ("../models/Event")

let eventController = module.exports;

eventController.getAllEvents = async (req, res) => {
  try {
    console.log("POST: cont/getAllEvents");
    const data = new Event();
    console.log("event", data)
    const result = await data.getAllEventsData (req.body);
    console.log("result", result)
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllEvents, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
eventController.updateChosenEvent = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenEvent");
    const car = new Event();
    const id = req.params.id;
    const result = await car.updateChosenEventData(
      id,
      req.body,
      req.member._id
    );
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateChosenEvent, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
