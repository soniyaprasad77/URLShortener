const { getUser } = require("../service/user.auth");

const restrictToLoggedInUserOnly = async (req, res, next) => {
  const userUid = req?.headers["authorization"];
  if (!userUid) return res.redirect("/login");
  const token = userUid.split("Bearer ")[1];
  const user = getUser(token);
  if (!user) return res.redirect("/login");

  req.user = user;
  next();
};

const checkAuth = (req, res, next) => {
  const userUid = req?.headers["authorization"];
  const token = userUid.split("Bearer ")[1];
  const user = getUser(token);
  req.user = user;
  next();
};
module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};
