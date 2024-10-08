const express = require("express");
const app = express();
const URL = require("../models/url.model");
const { connectToMongoDB } = require("../dbconnect");
const ejs = require("ejs");
const path = require("path");
const staticRoute = require("../routes/static.route.js");
const urlRoute = require("../routes/url.route");
const userRoute = require("../routes/user.route");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const {
  checkForAuthentication,
  restrictTo,
} = require("../middlewares/user.auth.middleware.js");

connectToMongoDB(process.env.MONGODBURL)
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

//path
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//dependencies (middlewares)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

//routes
app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use("/", staticRoute);
app.use("/user", userRoute);

app.get("/url/:shortID", async (req, res) => {
  const shortID = req.params.shortID;
  const entry = await URL.findOneAndUpdate(
    { shortID },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  return res.redirect(entry?.redirectURL);
});

app.listen(8001, () => {
  console.log(`server started at port: 8001 `);
});
