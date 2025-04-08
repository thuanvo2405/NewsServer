const News = require("../models/news.model");

const getNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ publishedAt: -1 }); //
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOneNews = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const news = await News.findById(id);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Hàm chuẩn hóa category: chữ cái đầu in hoa
    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const normalizedCategory = capitalizeFirstLetter(category);

    const newsList = await News.find({
      category: normalizedCategory, // Dùng category đã chuẩn hóa
    })
      .populate("comments.user", "name avatar")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ publishedAt: -1 });

    const total = await News.countDocuments({
      category: normalizedCategory,
    });

    if (!newsList || newsList.length === 0) {
      return res
        .status(404)
        .json({ message: `No news found for category: ${normalizedCategory}` });
    }

    res.status(200).json({
      message: "News retrieved successfully",
      category: normalizedCategory,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      data: newsList,
    });
  } catch (error) {
    console.error("Error in getNewsByCategory:", error);
    res.status(500).json({
      message: "Server error while fetching news by category",
      error: error.message,
    });
  }
};

const addNews = async (req, res) => {
  try {
    const news = await News.create(req.body);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndUpdate(id, req.body);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const updateNews = await News.findById(id);
    res.status(200).json(updateNews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllNews = async (req, res) => {
  try {
    await News.deleteMany({}); // Xóa toàn bộ bài viết
    res.status(200).json({ message: "All news articles have been deleted." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNewsByCategoryPage = async (req, res) => {
  try {
    const { category, page = 1 } = req.params;
    const limit = 12; // Mặc định mỗi trang hiển thị 12 bài viết

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Hàm chuẩn hóa category: chữ cái đầu in hoa
    const capitalizeFirstLetter = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const normalizedCategory = capitalizeFirstLetter(category);

    const newsList = await News.find({ category: normalizedCategory })
      .populate("comments.user", "name avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ publishedAt: -1 });

    const total = await News.countDocuments({ category: normalizedCategory });

    if (!newsList || newsList.length === 0) {
      return res
        .status(404)
        .json({ message: `No news found for category: ${normalizedCategory}` });
    }

    res.status(200).json({
      message: "News retrieved successfully",
      category: normalizedCategory,
      total,
      page: parseInt(page),
      limit,
      pages: Math.ceil(total / limit),
      data: newsList,
    });
  } catch (error) {
    console.error("Error in getNewsByCategory:", error);
    res.status(500).json({
      message: "Server error while fetching news by category",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID bài viết từ URL
    const { userId, text } = req.body; // Lấy ID người dùng và nội dung comment từ request body

    if (!userId || !text) {
      return res
        .status(400)
        .json({ message: "User ID và nội dung comment không được để trống" });
    }

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Thêm comment vào mảng comments của bài viết
    const newComment = { user: userId, text };
    news.comments.push(newComment);
    await news.save();

    res
      .status(200)
      .json({ message: "Thêm comment thành công", comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getUsersFromComments = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id).populate(
      "comments.user",
      "name avatar email "
    );

    if (!news) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết", data: [] });
    }

    // Kiểm tra nếu không có comment
    if (!news.comments || news.comments.length === 0) {
      return res
        .status(200)
        .json({ message: "Bài viết không có comment nào", data: [] });
    }

    // Lọc và map dữ liệu, xử lý trường hợp user không hợp lệ
    const usersFromComments = news.comments
      .filter((comment) => comment.user) // Chỉ lấy comment có user hợp lệ
      .map((comment) => ({
        userId: comment.user._id,
        name: comment.user.name || "Unknown",
        avatar: comment.user.avatar || null,
        email: comment.user.email || null,
        commentText: comment.text,
        createdAt: comment.createdAt,
        commentId: comment._id,
      }));

    res.status(200).json({
      message:
        usersFromComments.length > 0
          ? "Lấy thông tin người dùng từ comment thành công"
          : "Bài viết không có comment nào",
      data: usersFromComments,
    });
  } catch (error) {
    console.error("Error in getUsersFromComments:", error);
    res
      .status(500)
      .json({ message: "Lỗi server", error: error.message, data: [] });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentId } = req.body;

    // Sử dụng $pull để xóa comment khỏi mảng comments
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { $pull: { comments: { _id: commentId } } },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    const comment = news.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Không tìm thấy bình luận" });
    }

    comment.text = text;
    await news.save();

    res.status(200).json({ message: "Sửa bình luận thành công", comment });
  } catch (error) {
    console.error("Error in updateComment:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  getNews,
  addNews,
  updateNews,
  deleteNews,
  getOneNews,
  deleteAllNews,
  addComment,
  getNewsByCategory,
  getUsersFromComments,
  deleteComment,
  updateComment,
  getNewsByCategoryPage,
};
