const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  saveQuizResult,
} = require("../controllers/quizController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", authMiddleware, createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.post("/quiz-results", saveQuizResult);

module.exports = router;
