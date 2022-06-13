const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Joi = require("joi");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const database = require("../models");
const { Webhooks, Sequelize } = database;

const { buildResponse } = require("../utils/app");

const createWebhook = catchAsync(async (req, res, next) => {

  const schema = Joi.object().keys({
    callback_url: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
  }

  try {

    const { city_id } = req.params;
    req.body.city_id = Number(city_id);

    const newWebhook = await Webhooks.create(req.body);

    if (!newWebhook) {
      return next(new AppError(`Could not create new webhook at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.CREATED).json({
      status: "success",
      city: buildResponse(newWebhook.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const updateWebhook = catchAsync(async (req, res, next) => {

  const schema = Joi.object().keys({
    callback_url: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return next(new AppError(`${error.details[0].message}`, StatusCodes.UNPROCESSABLE_ENTITY));
  }

  try {

    const { webhook_id } = req.params;

    const updateWebhook = await Webhooks.update(req.body, { where: { id: webhook_id } });

    if (updateWebhook[0] <= 0) {
      return next(new AppError(`Could not update webhook at this time.`, StatusCodes.BAD_REQUEST));
    }

    const webhook = await Webhooks.findByPk(webhook_id);

    if (!webhook) {
      return next(new AppError(`Could not find webhook at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Webhook data updated successfully",
      webhook: buildResponse(webhook.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const removeWebhook = catchAsync(async (req, res, next) => {

  try {

    const { webhook_id } = req.params;

    const webhook = await Webhooks.findByPk(webhook_id);

    if (!webhook) {
      return next(new AppError(`Could not find city at this time.`, StatusCodes.BAD_REQUEST));
    }

    const deleteWebhook = await Webhooks.destroy({ where: { id: webhook_id } });

    if (deleteWebhook[0] <= 0) {
      return next(new AppError(`Could not delete Webhook at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Webhook data deleted successfully",
      webhook: buildResponse(webhook.dataValues)
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findWebhooks = catchAsync(async (req, res, next) => {

  try {

    const webhookAll = await Webhooks.findAll();

    const webhooks = [];
    webhookAll.forEach((webhook) => {
      if (webhook) webhooks.push(buildResponse(webhook.dataValues));
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Webhooks data retrieved successfully",
      webhook: webhooks
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

const findWebhook = catchAsync(async (req, res, next) => {

  try {

    const { webhook_id } = req.params;

    const webhook = await Webhooks.findByPk(webhook_id);

    if (!webhook) {
      return next(new AppError(`Could not find webhook at this time.`, StatusCodes.BAD_REQUEST));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Webhooks data retrieved successfully",
      webhook: ( (!webhook) ? {} : buildResponse(webhook.dataValues) ),
    });

  } catch (error) {
    return next(new AppError(`${error}`, StatusCodes.INTERNAL_SERVER_ERROR));
  }

});

module.exports = {
  createWebhook,
  updateWebhook,
  removeWebhook,
  findWebhooks,
  findWebhook
}