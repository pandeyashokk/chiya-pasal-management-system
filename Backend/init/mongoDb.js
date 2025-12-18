const mongoose = require("mongoose");
const { mongo_uri } = require("../config/keys");

const connectDatabase = async () => {
  try {
    await mongoose.connect(mongo_uri);
    console.log(`Database connection successful`);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = connectDatabase;
