const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // ID từ Google OAuth
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String }, // Ảnh đại diện từ Google
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
