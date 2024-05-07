const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const passport = require("passport");
const routes = require("./src/routes");
const passportConfig = require("./src/passport-config");
const cors = require("cors");
const flash = require('express-flash');
const session = require('express-session');
const mongoose = require("mongoose");

require("dotenv").config();

// cors config
app.use(
  cors()
);

app.use(bodyparser.json());
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passportConfig(passport);

// To connect to MongoDB
mongoose.connect(process.env.DB_HOST, {
  dbName: process.env.DB_NAME,
});

// To check connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error : "));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

routes(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(process.env.PORT, () => {
  console.log(`This is listening on port: ${process.env.PORT}`);
});
