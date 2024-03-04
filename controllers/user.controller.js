const User = require("../models/user.model");

const handleUserSignup = async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
 return res.redirect("/");
};
const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return  res.render("login", {
      error: "Invalid Username or Password",
    });
  }
  return res.redirect("/");
};

module.exports = {
  handleUserSignup,
  handleUserLogin
};
