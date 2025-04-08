const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");

const registerAdmin = async (req, res) => {
  try {
    const { fullname, adminname, email, password, phone } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const newAdmin = new Admin({ fullname, adminname, email, password, phone });
    await newAdmin.save();

    res.status(201).json({ message: "Đăng ký thành công", admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    res.status(200).json({ message: "Đăng nhập thành công", admin });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = { registerAdmin, loginAdmin };
