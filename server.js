require("dotenv").config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

const db = require("./models");
// console.log(db);
// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

// const dbConnect = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.gk4wf.mongodb.net/fashionStores?retryWrites=true&w=majority`;

// console.log("Connecting.... ", dbConnect)

// mongoose.connect(dbConnect, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
//   serverSelectionTimeoutMS: 15000
// }).then(() => console.log("DB connection successful!")).catch((err) => {
//   console.log(err)
// });

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
