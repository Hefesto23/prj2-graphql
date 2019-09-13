import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const genToken = userId => {
  return jwt.sign({ userId }, `${process.env.JWT_SECRET}`, { expiresIn: "1d" });
};

export { genToken as default };
