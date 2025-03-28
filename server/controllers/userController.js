const User = require("../model/User"); // Adjust the path to your User model
const Quiz = require("../model/Quiz"); // Adjust the path to your Quiz model

const getUserLeaderboard = async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from MongoDB
    console.log("Users fetched from MongoDB:", users);

    const processedLeaderboard = await Promise.all(
      users.map(async (user) => {
        const quizResults = {};

        for (const result of user.quizResults) {
          const quizId = result.quizId;
          const quiz = await Quiz.findById(quizId); // Fetch quiz details
          if (!quiz) continue; // Skip if quiz not found

          if (
            !quizResults[quizId] ||
            result.score > quizResults[quizId].score
          ) {
            quizResults[quizId] = {
              quizId: quizId,
              quizTitle: quiz.title, // Add quiz title
              score: result.score,
              totalMarks: result.totalMarks,
            };
          }
        }

        const quizEntries = Object.values(quizResults);

        return {
          userName: `${user.firstName} ${user.lastName}`,
          quizEntries: quizEntries,
        };
      })
    );

    processedLeaderboard.sort((a, b) => {
      const totalScoreA = a.quizEntries.reduce(
        (sum, entry) => sum + entry.score,
        0
      );
      const totalScoreB = b.quizEntries.reduce(
        (sum, entry) => sum + entry.score,
        0
      );
      return totalScoreB - totalScoreA;
    });

    res.json(processedLeaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserLeaderboard,
};
