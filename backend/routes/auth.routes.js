const express = require("express");
const { login, verifyOtp, register } = require("../controller/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);

module.exports = router;
