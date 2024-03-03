const express = require("express");
const app = express();
const urlRoute = require("./routes/url.route");
const URL = require("./models/url.model");
const { connectToMongoDB } = require("./dbconnect");
const ejs = require("ejs");
const path = require("path");
const staticRoute = require("./routes/static.route.js")

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use("/url", urlRoute);
app.use("/", staticRoute);

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
