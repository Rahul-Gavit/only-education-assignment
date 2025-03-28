const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { fileURLToPath } = require("url");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const Quiz = require("./model/Quiz");
const PORT = process.env.PORT || 5000;

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
connectDB();

//Get the directory path
const dirname = process.cwd();

//Function to load quizzes from JSON and insert into MongoDB if empty
const seedQuizzes = async () => {
  try {
    const existingQuizzes = await Quiz.countDocuments();

    if (existingQuizzes === 0) {
      const quizzesData = JSON.parse(
        fs.readFileSync(path.join(dirname, "data", "quizzes.json"), "utf-8")
      );
      await Quiz.insertMany(quizzesData);
      console.log("✅ Quizzes inserted successfully");
    } else {
      console.log("⚡ Quizzes already exist. Skipping insertion.");
    }
  } catch (error) {
    console.error("Error seeding quizzes:", error);
  }
};

seedQuizzes(); // Run the function on startup

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
