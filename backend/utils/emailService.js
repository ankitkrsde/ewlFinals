const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
exports.sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email - Explore with Locals",
    html: `
      <h2>Welcome to Explore with Locals!</h2>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>If you didn't create an account, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Request - Explore with Locals",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send booking confirmation email
exports.sendBookingConfirmation = async (booking, tourist, guide) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: tourist.email,
    subject: "Booking Confirmation - Explore with Locals",
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Your booking with ${guide.name} has been confirmed.</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Date: ${new Date(booking.date).toLocaleDateString()}</li>
        <li>Time: ${booking.startTime}</li>
        <li>Duration: ${booking.duration} hours</li>
        <li>Meeting Point: ${booking.meetingPoint}</li>
        <li>Total: ₹${booking.price}</li>
      </ul>
      <p>You can contact your guide at ${guide.email} or ${guide.phone}.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
