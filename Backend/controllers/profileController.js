const User = require("../models/User");
const { hashPassword } = require("../utils/hashPassword");

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json({
      code: 200,
      status: true,
      message: "Profile fetched successfully!!",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || "";

    const user = await User.findById(req.user._id);

    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }

    if (email && email !== user.email) {
      const isExists = await User.findOne({ email });
      if (isExists) {
        res.code = 400;
        throw new Error("Email already exists");
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    // Password update - ONLY if provided and not empty
    if (password && password.trim() !== "") {
      if (password.length < 8) {
        res.code = 400;
        throw new Error("Password must be at least 8 characters");
      }
      user.password = await hashPassword(password);
    }

    await user.save();

    res.json({
      code: 200,
      status: true,
      message: "Profile updated successfully",
      data: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile, updateMyProfile };
