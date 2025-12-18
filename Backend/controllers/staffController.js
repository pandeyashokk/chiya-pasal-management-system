const User = require("../models/User");
const { hashPassword } = require("../utils/hashPassword");

const getAllStaffs = async (req, res, next) => {
  try {
    const staffs = await User.find().select("-password");

    res.status(200).json({
      code: 200,
      status: true,
      message: "Staff fetched successfully",
      data: staffs,
    });
  } catch (error) {
    next(error);
  }
};

const createStaff = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!["waiter", "kitchen"].includes(role)) {
      res.code = 400;
      throw new Error("Role must be waiter or kitchen");
    }

    const isExists = await User.findOne({ email });
    if (isExists) {
      res.code = 400;
      throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

    const staff = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await staff.save();
    

    res.status(201).json({
      code: 201,
      status: true,
      message: "Staff created successfully",
      data: {
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const { id } = req.params;
    const staff = await User.findById(id);

    if (!staff) {
      res.code = 404;
      throw new Error("Staff not found");
    }

    if (staff.role === "admin") {
      res.code = 400;
      throw new Error("Cannot delete admin");
    }

    await staff.deleteOne();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Staff deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { getAllStaffs, deleteStaff, createStaff };
