const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const database = require("../models");
const { Cities, Temperatures, Sequelize } = database;

const { buildResponse } = require("../utils/app");

const NOW = new Date();

const createTemperature = catchAsync(async (req, res, next) => {

  const schema = Joi.object().keys({
    measurement: Joi.string(),
    max: Joi.number().required(),
    min: Joi.number().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
  }

  try {

    const { city_id } = req.params;
    req.body.city_id = Number(city_id);

    const newTemperature = await Temperatures.create(req.body);

    if (!newTemperature) {
      return next(new AppError(`Could not create new temperature at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.CREATED).json({
      status: "success",
      temperature: buildResponse(newTemperature.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const updateTemperature = catchAsync(async (req, res, next) => {

  const schema = Joi.object().keys({
    measurement: Joi.string().required(),
    max: Joi.number().required(),
    min: Joi.number().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
  }

  try {

    const { city_id, temperature_id } = req.params;
    req.body.city_id = Number(city_id);

    const updateTemp = await Temperatures.update(req.body, { where: { id: temperature_id } });

    if (updateTemp[0] <= 0) {
      return next(new AppError(`Could not update temperature at this time.`, StatusCodes.BAD_REQUEST));
    }

    const temperature = await Temperatures.findByPk(temperature_id);

    if (!temperature) {
      return next(new AppError(`Could not find temperature at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Temperature data updated successfully",
      temperature: buildResponse(temperature.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const removeTemperature = catchAsync(async (req, res, next) => {

  try {

    const { temperature_id } = req.params;

    const temperature = await Temperatures.findByPk(temperature_id);

    if (!temperature) {
      return next(new AppError(`Could not find temperature at this time.`, StatusCodes.BAD_REQUEST));
    }

    const deleteTemp = await Temperatures.destroy({ where: { id: temperature_id } });

    if (deleteTemp[0] <= 0) {
      return next(new AppError(`Could not delete temperature at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Temperature data deleted successfully",
      temperature: buildResponse(temperature.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findTemperatures = catchAsync(async (req, res, next) => {

  try {

    const temperatureAll = await Temperatures.findAll();

    const temperatures = [];
    temperatureAll.forEach((temperature) => {
      if (temperature) {
        temperatures.push(buildResponse(temperature.dataValues));
      }
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Temperature data retrieved successfully",
      temperature: temperatures
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findTemperaturesByCity = catchAsync(async (req, res, next) => {

  try {

    const { city_id } = req.params;

    const temperatureAll = await Temperatures.findAll({ where: { city_id: city_id } });

    const temperatures = [];
    temperatureAll.forEach((temperature) => {
      if (temperature) {
        temperatures.push(buildResponse(temperature.dataValues));
      }
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Temperature data retrieved successfully",
      temperature: temperatures
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findTemperature = catchAsync(async (req, res, next) => {

  try {

    const { temperature_id } = req.params;

    const temperature = await Temperatures.findByPk(temperature_id);

    if (!temperature) {
      return next(new AppError(`Could not find temperature at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Temperature data retrieved successfully",
      temperature: ((!temperature) ? {} : buildResponse(temperature.dataValues))
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const getForecast = catchAsync(async (req, res, next) => {

  try {

    const { city_id } = req.params;

    const temperatures = await Temperatures.findAll({
      where: {
        city_id: city_id
      }
    });

    let sumMin = 0;
    let sumMax = 0;
    let count = 0;

    temperatures.forEach((temp) => {
      count++;
      const { min, max, createdAt } = temp.dataValues;
      const then = new Date(createdAt);
      const msBetweenDates = Math.abs(then.getTime() - NOW.getTime());
      const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);
      if (hoursBetweenDates < 24) {
        sumMin += min;
        sumMax += max;
      }
    });

    const avgMin = (sumMin === 0) ? 0 : sumMin / count;
    const avgMax = (sumMax === 0) ? 0 : sumMax / count;

    const cityData = await Cities.findByPk(city_id);

    if (!cityData) {
      return next(new AppError(`Could not find city at this time.`, StatusCodes.BAD_REQUEST));
    }

    const data = {
      min: avgMin,
      max: avgMax,
      city: buildResponse(cityData.dataValues),
      sample: count
    };

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Temperature calculated successfully",
      forecast: data
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

module.exports = {
  createTemperature,
  updateTemperature,
  removeTemperature,
  findTemperatures,
  findTemperature,
  getForecast,
  findTemperaturesByCity
};