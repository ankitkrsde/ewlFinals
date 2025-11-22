const nodemailer = require("nodemailer");

// Create transporter - FIXED: createTransport instead of createTransporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send password reset email
exports.sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: `Explore With Locals <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Password Reset Request - Explore with Locals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Explore With Locals</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6;">Hi <strong>${user.name}</strong>,</p>
            <p style="color: #666; line-height: 1.6;">You requested to reset your password for your Explore With Locals account. Click the button below to proceed:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="color: #667eea; word-break: break-all; font-size: 14px; background: #f8f9fa; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This reset link will expire in 10 minutes.<br>
                If you didn't request this reset, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Send account status change email
exports.sendAccountStatusEmail = async (user, status, reason = "") => {
  const statusMessage =
    status === "activated"
      ? "Your account has been activated. You can now login and use all features."
      : "Your account has been deactivated. Please contact support for more information.";

  const subject =
    status === "activated"
      ? "Account Activated - Explore with Locals"
      : "Account Deactivated - Explore with Locals";

  const mailOptions = {
    from: `Explore With Locals <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Explore With Locals</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Account Status Update</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Account ${
              status.charAt(0).toUpperCase() + status.slice(1)
            }</h2>
            <p style="color: #666; line-height: 1.6;">Hi <strong>${
              user.name
            }</strong>,</p>
            <p style="color: #666; line-height: 1.6;">${statusMessage}</p>
            
            ${
              reason
                ? `
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; margin: 0; font-weight: bold;">Reason:</p>
                <p style="color: #856404; margin: 5px 0 0 0;">${reason}</p>
              </div>
            `
                : ""
            }
            
            ${
              status === "deactivated"
                ? `
              <p style="color: #666; line-height: 1.6;">
                If you believe this is a mistake, please contact our support team.
              </p>
            `
                : ""
            }
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated notification from Explore With Locals.
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Account status email sent successfully to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending account status email:", error);
    throw error;
  }
};

// Send ban notification email
exports.sendBanNotificationEmail = async (user, banned, reason = "") => {
  const subject = banned
    ? "Account Banned - Explore with Locals"
    : "Account Unbanned - Explore with Locals";

  const statusMessage = banned
    ? "Your account has been banned due to violation of our terms of service."
    : "Your account has been unbanned. You can now login and use our services.";

  const mailOptions = {
    from: `Explore With Locals <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Explore With Locals</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Account ${
            banned ? "Banned" : "Unbanned"
          }</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Account ${
              banned ? "Banned" : "Unbanned"
            }</h2>
            <p style="color: #666; line-height: 1.6;">Hi <strong>${
              user.name
            }</strong>,</p>
            <p style="color: #666; line-height: 1.6;">${statusMessage}</p>
            
            ${
              reason
                ? `
              <div style="background: ${
                banned ? "#f8d7da" : "#d1ecf1"
              }; border: 1px solid ${
                    banned ? "#f5c6cb" : "#bee5eb"
                  }; border-radius: 5px; padding: 15px; margin: 20px 0;">
                <p style="color: ${
                  banned ? "#721c24" : "#0c5460"
                }; margin: 0; font-weight: bold;">${
                    banned ? "Ban Reason" : "Note"
                  }:</p>
                <p style="color: ${
                  banned ? "#721c24" : "#0c5460"
                }; margin: 5px 0 0 0;">${reason}</p>
              </div>
            `
                : ""
            }
            
            ${
              banned
                ? `
              <p style="color: #666; line-height: 1.6;">
                If you believe this is a mistake, you can appeal this decision by contacting our support team.
              </p>
            `
                : `
              <p style="color: #666; line-height: 1.6;">
                Welcome back! We're glad to have you with us again.
              </p>
            `
            }
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                This is an automated notification from Explore With Locals.
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Ban notification email sent successfully to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending ban notification email:", error);
    throw error;
  }
};

// Send booking confirmation email
exports.sendBookingConfirmation = async (booking, tourist, guide) => {
  const mailOptions = {
    from: `Explore With Locals <${process.env.EMAIL_USER}>`,
    to: tourist.email,
    subject: "Booking Confirmation - Explore with Locals",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Explore With Locals</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmed</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Booking Confirmed!</h2>
            <p style="color: #666; line-height: 1.6;">Hi <strong>${
              tourist.name
            }</strong>,</p>
            <p style="color: #666; line-height: 1.6;">Your booking with <strong>${
              guide.name
            }</strong> has been confirmed.</p>
            
            <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 5px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin-top: 0;">Booking Details:</h3>
              <ul style="color: #333; line-height: 1.8;">
                <li><strong>Date:</strong> ${new Date(
                  booking.date
                ).toLocaleDateString()}</li>
                <li><strong>Time:</strong> ${booking.startTime}</li>
                <li><strong>Duration:</strong> ${booking.duration} hours</li>
                <li><strong>Meeting Point:</strong> ${booking.meetingPoint}</li>
                <li><strong>Total Amount:</strong> ₹${booking.price}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              You can contact your guide at <strong>${
                guide.email
              }</strong> or <strong>${guide.phone}</strong>.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Thank you for choosing Explore With Locals!
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      "Booking confirmation email sent successfully to:",
      tourist.email
    );
    return true;
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
};

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `Explore With Locals <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Welcome to Explore With Locals!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Explore With Locals</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome Aboard!</p>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Welcome to Explore With Locals!</h2>
            <p style="color: #666; line-height: 1.6;">Hi <strong>${
              user.name
            }</strong>,</p>
            <p style="color: #666; line-height: 1.6;">Thank you for joining Explore With Locals! We're excited to have you as part of our community.</p>
            
            <div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 5px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #0066cc; margin-top: 0;">Your Account Details:</h3>
              <ul style="color: #333; line-height: 1.8;">
                <li><strong>Name:</strong> ${user.name}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Role:</strong> ${user.role}</li>
                <li><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</li>
              </ul>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              You can now start exploring local guides or offering your services as a guide. 
              Your account is ready to use immediately!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${
                process.env.CLIENT_URL
              }/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you have any questions, feel free to contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent successfully to:", user.email);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw error;
  }
};
