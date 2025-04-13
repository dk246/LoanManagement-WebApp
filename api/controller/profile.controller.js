import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, address } = req.body;

  try {
    const updateFields = {
      username,
      email,
      address,
    };

    if (password) {
      updateFields.password = bcryptjs.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
