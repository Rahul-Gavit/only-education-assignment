const Quiz = require("../model/Quiz");
const User = require("../model/User");

const createQuiz = async (req, res) => {
  const { title, questions } = req.body;
  try {
    const newQuiz = await Quiz.create({
      title,
      questions,
      createdBy: req.user.id,
    });
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz", error });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes", error });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz", error });
  }
};

const saveQuizResult = async (req, res) => {
  try {
    const { userId, quizId, score, totalMarks } = req.body; // Extract data from request body

    console.log("User id is: ", userId);

    const user = await User.findById(userId);

    if (user) {
      user.quizResults.push({
        quizId: quizId,
        score: score,
        totalMarks: totalMarks,
      });

      await user.save();
      console.log("Quiz result saved to user's document");
      res.status(200).json({ message: "Quiz result saved successfully" });
    } else {
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res
      .status(500)
      .json({ message: "Error saving quiz result", error: error.message });
  }
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  saveQuizResult,
};
