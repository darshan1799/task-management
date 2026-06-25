const UserModel = require("../models/userModel");
const OtpModel = require("../models/otpModel");
const sendEmail = require("../utils/sendEmail");
const otpGenerator = require("../utils/otpGenerator");
const generateOtpVerificationEmail = require("../utils/emailTemplate");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing fields!",
      });
    }

    const user = await UserModel.findOne({
      email,
      deletedAt: null,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    const isVerifiedPass = await user.comparePassword(password);

    if (!isVerifiedPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    if (user.email === "demo@gmail.com") {
      return res.status(200).json({
        success: true,
        message: "Login successful! OTP sent on your email.",
      });
    }

    await OtpModel.deleteMany({ email: user.email });

    const otp = otpGenerator();

    const otpResponse = new OtpModel({
      email,
      otp,
    });

    await otpResponse.save();

    const response = await sendEmail(
      email,
      "verification code",
      generateOtpVerificationEmail(otp),
    );

    if (!response?.success) {
      return res.status(500).json({
        success: false,
        message: "Try again later! OTP not generated!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful! OTP sent to your email.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing fields!",
      });
    }

    const existingUser = await UserModel.findOne({
      email,
      deletedAt: null,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists!",
      });
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log(email);

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    if (email === "demo@gmail.com" && otp === "123456") {
      const user = await UserModel.findOne({
        email,
        deletedAt: null,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      const userInfo = {
        id: user._id,
        email: user.email,
        fullName: user.name,
      };

      const token = jwt.sign({ userInfo }, process.env.SECRET_KEY);

      res.cookie("access-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        data: userInfo,
      });
    }

    const otpData = await OtpModel.findOne({
      email,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP or expired",
      });
    }

    await otpData.deleteOne();

    const user = await UserModel.findOne({
      email,
      deletedAt: null,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    const userInfo = {
      id: user._id,
      email: user.email,
      fullName: user.name,
    };

    const token = jwt.sign({ userInfo }, process.env.SECRET_KEY);

    res.cookie("access-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      data: userInfo,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("access-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  verifyOtp,
  login,
  register,
  logoutUser,
};
