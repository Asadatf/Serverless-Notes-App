import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import logger from "../utils/logger.js";

const requireAuth = async (req, res, next) => {
  //verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    logger.warn("Authorization token required but not provided");
    return res.status(404).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);

    req.user = await User.findOne({ _id }).select("_id");

    if (!req.user) {
      logger.warn(`Invalid user ID in token: ${_id}`);
      return res.status(401).json({ error: "Request is not authorized" });
    }

    logger.info(`User authenticated successfully with ID: ${_id}`);
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

export { requireAuth };
