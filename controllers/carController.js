const assert = require("assert")
const Definer = require("../lib/mistake");
const Car = require("../models/Car")

let carController = module.exports;

carController.getAllCars = async (req, res) => {
  try {
    console.log("POST: cont/getAllCars");
    const car = new Car();
    const result = await car.getAllCarsData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getAllCars, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

carController.getChosenCar = async (req, res) => {
  try {
    console.log("POST: cont/getChosenCar");
    const car = new Car();
    const id = req.params.id;
    const result = await car.getChosenCarData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getChosenCar, ${err.message}`)
    res.json({state: 'fail', message: err.message})

  }
}

/****************************************
 * BSSR RELATED METHODS
 ****************************************/

carController.addNewCar = async (req, res) => {
  try {
    console.log("POST: cont/addNewCar");

    assert(req.files, Definer.general_err3);

      const car = new Car();
      let data = req.body;

      data.car_images = req.files.map((ele) => {
          return ele.path.replace(/\\/g, '/');
      });
      
      const result = await car.addNewCarData(data, req.member);

      const html = `<script>
                     alert('new car added successfully');
                     window.location.replace("/resto/cars/menu");
                   </script>`;
      res.end(html);
  } catch (err) {
    console.log(`ERROR, cont/addNewCar, ${err.message}`);
  }
};

carController.updateChosenCar = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenCar");
    const car = new Car();
    const id = req.params.id;
    const result = await car.updateChosenCarData(id, req.body, req.member._id);
    await res.json({state: "success", data: result});
  } catch (err) {
    console.log(`ERROR, cont/updateChosenCar, ${err.message}`);
    res.json({state: 'fail', message: err.message})
  }
};
