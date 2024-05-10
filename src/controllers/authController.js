const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password didn't match. Please try again.",
      });
    }

    // Check if user already exists
    console.log("existing user before query", email, password);

    const existingUser = await User.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Failed to signUp", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered. Please sign up.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user.id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      await user.update({ token: token });

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res
        .cookie("token", token, options)
        .status(200)
        .json({
          success: true,
          token,
          user: {
            id: user.id,

            email: user.email,
            role: user.role,
          },
          message: "User logged in successfully",
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      success: false,
      message: "Cannot login. Please try again",
    });
  }
};
