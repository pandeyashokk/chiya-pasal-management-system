const User = require("../models/User");
const { comparePassword } = require("../utils/comparePassword");
const { generateToken } = require("../utils/generateToken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("User Not Found");
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.code = 401;
      throw new Error("Invalid Credentials");
    }

    const token = generateToken(user);

    res.status(200).json({
      code: 200,
      status: true,
      message: "User signin successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      data: { token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
