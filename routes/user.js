const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/Auth");

const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login); // Uncommented this line for the login route
router.get("/sign1", (req, res) => {
  res.send("Till now correct");
});

//Testing protected route for single middlewares

router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "This is protected route for testing middlewares",
  });
});

router.get("/student", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "This is protected route for Student",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "This is protected route for Admin",
  });
});

module.exports = router;
