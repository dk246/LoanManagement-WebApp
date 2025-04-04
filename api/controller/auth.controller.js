import jwt from "jsonwebtoken";

import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPAssword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPAssword });

  try {
    await newUser.save();
    res.json({ message: "User created success" });
  } catch (error) {
    res.json({ message: "User existing" });
  }
};
