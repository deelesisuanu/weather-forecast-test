const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp"); 
const cookieParser = require("cookie-parser");
const compression = require("compression");

const cors = require("cors");

const AppError = require("./utils/appError");

const globalErrorHandler = require("./controllers/errorController");

const { citiesRoutes, temperaturesRoutes, webhookRoutes } = require("./routes");

const app = express();

app.enable("trust proxy");

app.use(cors());
app.use(morgan('tiny'));

app.use(function (req, res, next) {
  res.header("Content-Type", "application/json;charset=UTF-8");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options("*", cors());

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 20000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({ whitelist: ["duration", "ratingsQuantity", "ratingsAverage", "maxGroupSize", "difficulty", "price"] })
);

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/route", [citiesRoutes, temperaturesRoutes, webhookRoutes]);

/**
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/checkout", checkoutRoutes);
app.use("/api/v1/admin", adminRoutes);
*/

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
