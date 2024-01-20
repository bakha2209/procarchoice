console.log("Web Serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router");

const router_bssr = require("./router_bssr");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

// 1 Kirish code
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2 Session code
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next();
});

// 3 Views code
app.set("views", "views");
app.set("view engine", "ejs");

//Routing code
app.use("/", router);
app.use("/resto", router_bssr);

module.exports = app;
