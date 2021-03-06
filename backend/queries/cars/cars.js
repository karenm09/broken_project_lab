const db = require("../../db/index");

const getAllCars = async (req, res, next) => {
  try {
    const cars = await db.any("SELECT * FROM cars")
    res.json({
      status: "success",
      message: "all cars",
      cars
    });
  } catch (err) {
    console.log(err)
    res.json({
      status: "error",
      payload: null,
      message: err
    });
    next(err);
  }
};

const getSingleCar = async (req, res, next) => {
  try {
    let car = await db.one("SELECT * FROM users WHERE id=$1", req.params.id);
    res.json({
      status: "success",
      car,
      message: "Received ONE CAR!"
    });
  } catch (err) {
    next(err);
  }
};

const createCar = async (req, res, next) => {
  try {
    await db.none(
      "INSERT INTO cars (brand, model, year, owner_id) VALUES (${brand}, ${model}, ${year}, ${owner_id})",
      req.body)

    res.json({
      status: "success",
      message: "New car added"
    });
  } catch (err) {
    res.json({
      status: "error",
      payload: null,
      message: err
    });
  }
};

const deleteCar = async (req, res, next) => {
  try {
    let result = await db.none("DELETE FROM cars WHERE id=$1", req.params.id);
    res.json({
      status: "success",
      message: "You destroyed the car",
      result: result
    });
  } catch (err) {
    next(err);
  }
};

const updateCar = async (req, res, next) => {
  try {
    let car = await db.one(
      "UPDATE cars SET id = ${id}, brand=${brand}, model=${model}, year=${year}, owner_id=${owner_id} WHERE id = ${id} RETURNING *",
      {
        id: parseInt(req.params.id),
        brand: req.body.brand,
        model: req.body.model,
        year: parseInt(req.body.year),
        owner_id: parseInt(req.body.owner_id)
      }
    );
    res.json({
      status: "success",
      message: "updated one car",
      car
    });
  } catch (err) {
    next(err);
  }
};

const updateCarFeature = async (req, res, next) => {
  try {
    let queryStringArray = [];
    let bodyKeys = Object.keys(req.body);
    bodyKeys.forEach(key => {
      console.log(key)
      queryStringArray.push(key + "=${" + key + "}");
    });
    let queryString = queryStringArray.join(", ");
    if (req.body.owner_id && req.body.owner_id.toLowerCase() === "null") {
      req.body.owner_id = null;
    }
    if (req.body.year && req.body.year.toLowerCase() === "null") {
      req.body.year = null;
    }

    db.none(
      "UPDATE cars SET " + queryString + " WHERE id=" + req.params.id,
      req.body
    );

    res.json({
      status: "success",
      message: "You Updated a CAR!"
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCars, getSingleCar, createCar, deleteCar, updateCar, updateCarFeature };
