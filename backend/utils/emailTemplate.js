function generateOtpVerificationEmail(otp, options = {}) {
  const {
    companyName = "TaskFlow",
    userName = null,
    expirationMinutes = 10,
    supportEmail = "support@taskflow.com",
    brandColor = "#2563EB",
    logoUrl = null,
  } = options;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${companyName} Verification Code</title>
</head>
<body>
  <div style="max-width:600px;margin:auto;padding:20px;font-family:Arial,sans-serif;">
    <h1 style="color:${brandColor};text-align:center;">
      ${companyName} Verification Code
    </h1>

    <p>Hello ${userName || "User"},</p>

    <p>
      Use the verification code below to securely access your
      ${companyName} account.
    </p>

    <div
      style="
        text-align:center;
        font-size:32px;
        font-weight:bold;
        letter-spacing:8px;
        padding:20px;
        margin:20px 0;
        border:2px dashed ${brandColor};
        border-radius:8px;
      "
    >
      ${otp}
    </div>

    <p>
      This code will expire in ${expirationMinutes} minutes.
    </p>

    <p>
      Never share this code with anyone. Our team will never ask for your OTP.
    </p>

    <hr />

    <p>
      If you did not request this code, you can safely ignore this email.
    </p>

    <p>
      Support: ${supportEmail}
    </p>

    <p>
      © ${new Date().getFullYear()} ${companyName}
    </p>
  </div>
</body>
</html>`;
}

module.exports = generateOtpVerificationEmail;
