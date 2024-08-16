const { getUser } = require("../service/user.auth");

const checkForAuthentication = (req, res, next) => {
  // const authorizationHeaderValue = req.headers["authorization"];
  const tokenCookie = req.cookies?.token;
  req.user = null;
  if (!tokenCookie) return next();
  const token = tokenCookie;
  const user = getUser(token);

  req.user = user;
  return next();
};

const restrictTo = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.redirect("/login");
    if (!roles.includes(req?.user?.role)) return res.end("Unauthorized");
    return next();
  };
};

module.exports = {
  checkForAuthentication,
  restrictTo,
};
