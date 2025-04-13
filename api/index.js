import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import profileRoutes from "./routes/profile.route.js";
import loanRoutes from "./routes/loan.route.js";
import requestRoutes from "./routes/admin.route.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose

  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("server listening on port 3000");
});
// app.get("/", (req, res) => {
//   res.json({
//     message: "API is working",
//   });
// });

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/admin", requestRoutes);
