const express = require("express");
const app = express();
const urlRoute = require("./routes/url.route");
const URL = require("./models/url.model");
const { connectToMongoDB } = require("./dbconnect");
connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/url", urlRoute);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.end(`
  <html>
  <head></head>
  <body>
  <h1>Hello form server</h1>
  <ol>
   ${allUrls.map((url) => `<li>${url.shortID} - ${url.redirectURL} - ${url.visitHistory.length}</li>`)}
  </ol>
  </body>
  </html>`);
});
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
