const express = require("express");
const {
  login,
  verifyOtp,
  register,
  logoutUser,
} = require("../controller/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);
router.post("/logout", logoutUser);

module.exports = router;
