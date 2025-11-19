import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  // Middleware logic to protect routes
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized", error: "No access token provided" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", error: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Access token expired" });
    }
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const adminRoute = (req, res, next) => {
    // Middleware logic to allow only admin users
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden - Admins only" });
    }
};
