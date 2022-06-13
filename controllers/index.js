const controllers = {};

controllers.CitiesController = require("./cities.controller");
controllers.TemperatureController = require("./temperatures.controller");
controllers.WebhookController = require("./webhook.controller");

module.exports = controllers;