import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectedRoute = async (req, res, next) => {
  try {
    console.log(1111);
    
    const token = req.cookies.jwt;
    if (!token) return res.status(401).send({ message: "No token provided" });
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded)
      return res.status(401).send({ message: "Token expired or invalid" });
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).send({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log(`Error in protectedRoute middleware: ${error}`);
    res.status(500).send({ message: "internal server error" });
  }
};
