const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a password reset email with a link containing the reset token.
 */
const sendResetEmail = async (toEmail, resetToken, clientUrl) => {
  const resetUrl = `${clientUrl || process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"CVArticulate" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset — CVArticulate",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F5F3F0; border-radius: 16px;">
        <h2 style="color: #2C3440; margin-bottom: 8px;">Reset Your Password</h2>
        <p style="color: #434C5E; font-size: 14px; line-height: 1.6;">
          We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.
        </p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 12px 32px; background: linear-gradient(135deg, #2C3440, #434C5E); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
          Reset Password
        </a>
        <p style="color: #9C8D7F; font-size: 12px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #CDBFA5; margin: 24px 0;" />
        <p style="color: #9C8D7F; font-size: 11px;">CVArticulate &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"CVArticulate" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify Your Email — CVArticulate",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F5F3F0; border-radius: 16px;">
        <h2 style="color: #2C3440; margin-bottom: 8px;">Verify Your Email</h2>
        <p style="color: #434C5E; font-size: 14px; line-height: 1.6;">
          Thank you for choosing CVArticulate. Please use the following 6-digit One-Time Password (OTP) to verify your account and complete registration. This code is valid for <strong>10 minutes</strong>:
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <span style="display: inline-block; padding: 12px 36px; background: linear-gradient(135deg, #2C3440, #434C5E); color: #fff; border-radius: 8px; font-weight: 700; font-size: 24px; letter-spacing: 6px; box-shadow: 0 4px 12px rgba(44, 52, 64, 0.15);">
            ${otp}
          </span>
        </div>
        <p style="color: #9C8D7F; font-size: 12px;">
          If you did not request this verification, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #CDBFA5; margin: 24px 0;" />
        <p style="color: #9C8D7F; font-size: 11px;">CVArticulate &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail, sendOTPEmail };
