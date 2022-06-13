const express = require("express");
const { CitiesController } = require("../controllers");

const { createCity, updateCity, removeCity, findCities, findCity } = CitiesController;

const router = express.Router();

router.route("/cities").post(createCity).get(findCities);
router.route("/cities/:city_id").patch(updateCity).delete(removeCity).get(findCity);

module.exports = router;