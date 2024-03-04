const express = require("express");
const app = express();
const URL = require("./models/url.model");
const { connectToMongoDB } = require("./dbconnect");
const ejs = require("ejs");
const path = require("path");
const staticRoute = require("./routes/static.route.js");
const urlRoute = require("./routes/url.route");
const userRoute = require("./routes/user.route");
const cookieParser = require("cookie-parser");
const {
  restrictToLoggedInUserOnly,
  checkAuth,
} = require("./middlewares/user.auth.middleware.js");

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

//path
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//dependencies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/", checkAuth, staticRoute);
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
  return res.redirect(entry.redirectURL);
});

app.listen(8001, () => {
  console.log(`server started at port: 8001 `);
});
