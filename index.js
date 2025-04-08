const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const newsRoute = require("./routes/news.route.js");
const userRoutes = require("./routes/user.route.js");
const adminRoutes = require("./routes/admin.route.js");

const app = express();
const port = process.env.PORT ;

app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cấu hình multer
const upload = multer({ dest: "uploads/" });
app.use("/api/news", upload.single("audio"), newsRoute);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Atlas");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((error) => console.error("❌ MongoDB connection failed:", error));
