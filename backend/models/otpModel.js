const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  },
);

otpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const OtpModel = mongoose.models.otps || mongoose.model("otps", otpSchema);

module.exports = OtpModel;
