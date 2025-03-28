const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Adjust the path

router.get("/leaderboard", userController.getUserLeaderboard);

module.exports = router;
