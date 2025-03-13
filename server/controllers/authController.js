const User = require("../models/User");

const loginUser = async (req, res) => {
  const { uid, name, email } = req.body;
  try {
    let user = await User.findOne({ uid, name, email });
    if (!user) {
      user = new User({ uid, name, email });
      await user.save();
    }
    res.status(200).json({ success: true, message: "User logged in", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  loginUser,
};
