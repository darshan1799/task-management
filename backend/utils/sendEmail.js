const nodemailer = require("nodemailer");

const sendEmail = async (receiver, subject, body) => {
  console.log(process.env.EMAIL_HOST);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const options = {
    from: `"DARSHAN SUTARIYA" <${process.env.EMAIL_USER}>`,
    to: receiver,
    subject,
    html: body,
  };

  try {
    await transporter.sendMail(options);
    return { success: true };
  } catch (err) {
    console.log(err.message);
    return { success: false, error: err };
  }
};

module.exports = sendEmail;
