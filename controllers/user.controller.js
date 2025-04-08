const User = require("../models/user.model");

const loginUser = async (req, res) => {
  try {
    const { uid, displayName, email, photoURL } = req.body;

    let user = await User.findOne({ googleId: uid });

    if (!user) {
      user = new User({
        googleId: uid,
        name: displayName,
        email: email,
        avatar: photoURL,
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Lỗi xác thực Google" });
  }
};

module.exports = { loginUser };
