//Auth ,isStudent , isAdmin ,   isVisitor
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //extracting jwt token
    //PENDING the others way for extracting

    const token = req.body.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //Verifing the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log(payload);
      req.user = payload;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong , while veryfing token try Again",
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students",
      });
    }
    // If the user is a student, proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Admin",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};
