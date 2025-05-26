import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Store in .env file

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function generateToken(user) {
  return jwt.sign({ id: user._id, role: user.UT_Role }, JWT_SECRET, {
    expiresIn: "1d",
  });
}
