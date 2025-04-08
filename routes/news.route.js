const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/news.controller");

router.get("/", getNews);
router.get("/:id", getOneNews);
router.get("/category/:category", getNewsByCategory);
router.get("/:id/comments/users", getUsersFromComments);
router.get("/category/:category/:page?", getNewsByCategoryPage);

router.post("/", addNews);
router.post("/:id/comment", addComment);

router.delete("/:id", deleteNews);
router.delete("/", deleteAllNews);
router.delete("/:id/comment", deleteComment);

router.put("/:id", updateNews);
router.put("/:id/comment/:commentId", updateComment);

module.exports = router;
