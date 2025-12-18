require("dotenv").config();

const {
  PORT,
  MONGO_URI,
  JWT_SECRET_KEY,
  KHALTI_SECRET_KEY,
  KHALTI_PUBLIC_KEY,
  KHALTI_RETURN_URL,
  KHALTI_FAILURE_URL,
} = process.env;

module.exports = {
  port: PORT,
  mongo_uri: MONGO_URI,
  jwtSecret: JWT_SECRET_KEY,
  khaltiSecretKey: KHALTI_SECRET_KEY,
  khaltiPublicKey: KHALTI_PUBLIC_KEY,
  khaltiReturnUrl: KHALTI_RETURN_URL,
  khaltiFailureUrl: KHALTI_FAILURE_URL,
};
