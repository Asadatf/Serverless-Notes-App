import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import validator from "validator";
import { FRONTEND_ORIGIN } from "../constants.js";
import logger from "../utils/logger.js";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    logger.info({ username }, "Login attempt");
    const user = await User.login(username, password);

    const token = createToken(user._id);

    logger.info({ username }, "User logged in successfully");

    res.status(200).json({
      username: user.username,
      email: user.email,
      pic: user.pic,
      token,
    });
  } catch (error) {
    logger.error({ username }, `Login failed - ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    logger.info({ username, email }, "Signup attempt");

    // Validate password strength using validator
    if (!validator.isStrongPassword(password)) {
      logger.warn("Signup attempt with weak password");
      throw Error("Password is not strong enough");
    }

    const user = await User.signup(username, email, password);

    const token = createToken(user._id);

    logger.info({ username, email }, "User signed up successfully");
    res.status(200).json({ username, email, token });
  } catch (error) {
    logger.error({ username, email }, `Signup failed - ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};

// forget Password
const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    logger.info({ email }, "Password reset requested");

    const user = await User.findOne({ email });

    if (!user) {
      logger.warn({ email }, "User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: "10m",
    });

    const base64Token = Buffer.from(token).toString("base64");
    const encodedToken = encodeURIComponent(base64Token);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD_APP_EMAIL,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="${FRONTEND_ORIGIN}/reset-password/${encodedToken}">${FRONTEND_ORIGIN}/reset-password/${encodedToken}</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(
          { email },
          `Failed to send reset password email - ${error.message}`
        );
        return res.status(400).json({ message: error.message });
      }
      logger.info({ email }, "Reset password email sent");
      res.status(200).json({ message: "Email Sent" });
    });
  } catch (error) {
    logger.error({ email }, `Error during forget password - ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

// reset Password
const resetPassword = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET);

    if (!decodedToken) {
      logger.warn(`Invalid token for password reset`);
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await User.findOne({ _id: decodedToken.userId });

    if (!user) {
      logger.warn({ token: req.params.token }, "No user found for token");
      return res.status(401).json({ message: "No user found" });
    }

    const { password } = req.body;

    if (!validator.isStrongPassword(password)) {
      logger.warn("Password is not strong enough");
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    user.password = password;
    await user.save();

    logger.info({ userId: user._id }, "Password successfully updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (error) {
    logger.error(`Error during password reset - ${error.message}`);
    res.status(400).json({ message: error.message });
  }
};

const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (req.body.pic) {
      user.pic = req.body.pic;
    }

    if (req.body.newPassword || req.body.currentPassword) {
      if (!req.body.newPassword) {
        return res.status(400).json({
          message: "New password is required to update your password",
        });
      }

      if (req.body.currentPassword !== user.password) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      if (!validator.isStrongPassword(req.body.newPassword)) {
        return res.status(400).json({
          message:
            "New password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.",
        });
      }

      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      pic: updatedUser.pic,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error updating profile: ${error.message}` });
  }
};

export { signupUser, loginUser, forgetPassword, resetPassword, userProfile };
