const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const database = require("../models");
const { Temperatures, Webhooks, Cities, Sequelize } = database;

const { buildResponse } = require("../utils/app");

const createCity = catchAsync(async (req, res, next) => {

  const schema = Joi.object().keys({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
  }

  try {

    const newCity = await Cities.create(req.body);

    if (!newCity) {
      return next(new AppError(`Could not create new city at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.CREATED).json({
      status: "success",
      city: buildResponse(newCity.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const updateCity = catchAsync(async (req, res, next) => {

  const schema = Joi.object().keys({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
  }

  try {

    const { city_id } = req.params;

    const updateCity = await Cities.update(req.body, { where: { id: city_id } });

    if (updateCity[0] <= 0) {
      return next(new AppError(`Could not update city at this time.`, StatusCodes.BAD_REQUEST));
    }

    const city = await Cities.findByPk(city_id);

    if (!city) {
      return next(new AppError(`Could not find city at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "City data updated successfully",
      city: buildResponse(city.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const removeCity = catchAsync(async (req, res, next) => {

  try {

    const { city_id } = req.params;

    const city = await Cities.findByPk(city_id);

    if (!city) {
      return next(new AppError(`Could not find city at this time.`, StatusCodes.BAD_REQUEST));
    }

    // remove temperatures
    await Temperatures.destroy({ where: { city_id: city_id } });

    // remove webhooks
    await Webhooks.destroy({ where: { city_id: city_id } });

    const deleteCity = await Cities.destroy({ where: { id: city_id } });

    if (deleteCity[0] <= 0) {
      return next(new AppError(`Could not update city at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "City data deleted successfully",
      city: buildResponse(city.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findCities = catchAsync(async (req, res, next) => {

  try {

    const cityAll = await Cities.findAll();

    const cities = [];
    cityAll.forEach((city) => {
      if (city) cities.push(buildResponse(city.dataValues));
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "City data retrieved successfully",
      city: cities
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findCity = catchAsync(async (req, res, next) => {

  try {

    const { city_id } = req.params;

    const city = await Cities.findByPk(city_id);

    if (!city) {
      return next(new AppError(`Could not find city at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "City data retrieved successfully",
      city: ( (!city) ? {} : buildResponse(city.dataValues) ),
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

module.exports = {
  createCity,
  updateCity,
  removeCity,
  findCities,
  findCity
}