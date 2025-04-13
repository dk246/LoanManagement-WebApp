import jwt from "jsonwebtoken";

import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import Loan from "../models/loan.model.js";

export const signup = async (req, res) => {
  const { username, email, fullname, address, phone, password } = req.body;
  const hashedPAssword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashedPAssword,
    fullname,
    address,
    phone,
  });

  try {
    await newUser.save();

    res.status(200).json({ message: "User created success" });
  } catch (error) {
    res.status(401).json({ message: "User existing", error });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const validPass = bcryptjs.compareSync(password, validUser.password);
    if (!validPass) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const loan = await Loan.findOne({ user: validUser._id });
    const token = jwt.sign({ id: validUser._id }, "ttt");
    const { password: pass, ...userWithoutPass } = validUser._doc;

    res
      .cookie("acces_token", token, { httpOnly: true })
      .status(200)
      .json({ success: true, ...userWithoutPass, loan });
  } catch (error) {
    console.error("Error signIn:", error);
    res.status(500).json({ success: false, message: "User login failed" });
  }
};
