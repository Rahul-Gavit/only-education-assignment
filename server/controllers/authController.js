const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const Signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    //check user exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create newUser
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res
      .status(200)
      .json({
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token,
      });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};

module.exports = { Signup, Login };
