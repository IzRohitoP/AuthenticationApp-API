const bcrypt = require("bcrypt");
const dotenv = require("dotenv"); // Imported dotenv library
const jwt = require("jsonwebtoken");
const User = require("../models/User");
dotenv.config(); // Load environment variables from .env file

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User successfully created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Validation of email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill the email and password first",
      });
    }

    // Check if the user with the provided email exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }
    //We need payload to create a token while login to system
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    // Verify the password and generate a JSON web token
    if (bcrypt.compare(password, user.password)) {
      //password matched
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      // console.log(user);

      //Making user as obect
      user = user.toObject();
      user.token = token;

      // console.log(user);

      user.password = undefined;

      // console.log(user);

      const options = {
        httpOnly: true,
        maxAge: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 hours
      };

      res.cookie("token", token, options).status(400).json({
        success: true,
        token,
        user,
        message: "User loggined Successfully",
      });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password Incorrect",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while logging in",
    });
  }
};
