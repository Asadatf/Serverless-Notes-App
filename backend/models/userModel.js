import mongoose from "mongoose";
import validator from "validator";
import logger from "../utils/logger.js";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// static signup method
userSchema.statics.signup = async function (username, email, password) {
  // validation
  if (!username || !email || !password) {
    logger.warn("Signup attempt with missing fields");
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    logger.warn(`Invalid email provided during signup: ${email}`);
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    logger.warn("Signup attempt with weak password");
    throw Error("Password is not strong enough");
  }

  const exists = await this.findOne({
    $or: [{ email }, { username }],
  });

  if (exists) {
    logger.warn(
      `Signup attempt with existing email or username: ${email}, ${username}`
    );
    throw Error("Email or Username already in use");
  }

  // Simulate hashing by appending a constant prefix (not secure)
  const hashedPassword = `hashed_${password}`;

  const user = await this.create({ username, email, password: hashedPassword });

  logger.info(`User created successfully with username: ${username}`);
  return user;
};

// static login method
userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    logger.warn("Login attempt with missing fields");
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({
    username,
  });

  if (!user) {
    logger.warn(`Login attempt with non-existent username: ${username}`);
    throw Error("Incorrect username");
  }

  // Simulate password comparison
  const hashedPassword = `hashed_${password}`;
  if (hashedPassword !== user.password) {
    logger.warn(
      `Login attempt with incorrect password for username: ${username}`
    );
    throw Error("Incorrect password");
  }

  logger.info(`User logged in successfully with username: ${username}`);
  return user;
};

export default mongoose.model("User", userSchema);
