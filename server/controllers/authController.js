const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

// login or create user
const loginUser = asyncHandler(async (req, res) => {
  const { uid, name, email } = req.body;

  // basic input validation
  if (!uid?.trim() || !name?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "corrupted parameters" });
  }

  // find user
  let user = await User.findOne({ uid });

  // if user does not exist, create new
  if (!user) {
    user = new User({ uid, name, email });
    await user.save();
  }

  res.status(200).json({ success: true, message: "User logged in", user });
});

module.exports = {
  loginUser,
};
