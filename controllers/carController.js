let carController = module.exports;

carController.getAllCars = async (req, res) => {
  try {
    console.log("GET: cont/getAllCars");
  } catch (err) {
    console.log(`ERROR, cont/getAllCars, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

carController.addNewCar = async (req, res) => {
  try {
    console.log("POST: cont/addNewCar");

    //TODO: product creation develop

    res.send("ok");
  } catch (err) {
    console.log(`ERROR, cont/addNewCar, ${err.message}`);
  }
};

carController.updateChosenCar = async (req, res) => {
  try {
    console.log("POST: cont/updateChosenCar");
  } catch (err) {
    console.log(`ERROR, cont/updateChosenCar, ${err.message}`);
  }
};
