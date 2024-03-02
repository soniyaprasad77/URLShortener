const express = require("express");
const router = express.Router();
const {
  handleGetNewURLShortener,
  handleGetAnalytics,
} = require("../controllers/url.controller.js");

router.post("/", handleGetNewURLShortener);
router.get("/analytics/:shortID", handleGetAnalytics);
module.exports = router;
