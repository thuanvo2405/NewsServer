const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    source: {
      id: { type: String, default: null },
      name: { type: String, required: true },
    },

    author: { type: String, default: "Unknown" },

    title: { type: String, required: true },

    description: { type: String, required: true },

    url: { type: String, default: null },

    urlToImage: { type: String, required: true },

    publishedAt: { type: Date, required: true },

    content: { type: String, required: true },

    video: { type: String, default: null },

    likes: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },

    comments: {
      type: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Thêm ObjectId cho comment
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          text: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    category: {
      type: [String],
      default: ["Business", "Technology"],
      required: true,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", newsSchema);
module.exports = News;
