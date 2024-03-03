const shortid = require("shortid");
const URL = require("../models/url.model");

const handleGetNewURLShortener = async (req, res) => {
  const body = req?.body;
  if (!body.url) return res.status(400).json({ error: "url not found" });
  console.log(body.url);
  const shortID = shortid();
  console.log(shortID);

  await URL.create({
    shortID: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.render("home", { id: shortID });
};

const handleGetAnalytics = async (req, res) => {
  const shortID = req.params.shortID;
  const result = await URL.findOne({ shortID });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
};

module.exports = {
  handleGetNewURLShortener,
  handleGetAnalytics,
};
