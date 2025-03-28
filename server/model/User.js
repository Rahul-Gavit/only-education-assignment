const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  quizResults: [
    {
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz", // Reference to the Quiz model
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      totalMarks: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
