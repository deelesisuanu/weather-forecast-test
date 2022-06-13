const routes = {};

routes.citiesRoutes = require("./cities.routes");
routes.temperaturesRoutes = require("./temperatures.routes");
routes.webhookRoutes = require("./webhooks.routes");

module.exports = routes;