const express = require("express");
const { TemperatureController } = require("../controllers");

const {
  createTemperature, updateTemperature,
  removeTemperature, findTemperaturesByCity,
  findTemperatures, findTemperature,
  getForecast } = TemperatureController;

const router = express.Router();

router.route("/temperatures/by/:city_id").post(createTemperature).get(findTemperaturesByCity);
router.route("/temperatures/all").get(findTemperatures);

router.route("/temperatures/rt/:city_id/find/:temperature_id")
  .patch(updateTemperature);

router.route("/temperatures/in/:temperature_id")
  .delete(removeTemperature).get(findTemperature);

router.route("/temperatures/fr/:city_id/forecast").get(getForecast);

module.exports = router;