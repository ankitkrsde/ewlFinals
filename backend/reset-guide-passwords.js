const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const resetGuidePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const guideEmails = [
      "amit.verma@example.com",
      "sneha.patel@example.com",
      "rohan.mehta@example.com",
      "priya.singh@example.com",
      "karan.malhotra@example.com",
      "neha.gupta@example.com",
      "vikram.joshi@example.com",
      "anjali.reddy@example.com",
    ];

    let updatedCount = 0;

    for (const email of guideEmails) {
      try {
        const user = await User.findOne({ email });

        if (user) {
          // Reset password to "password123"
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("password123", salt);

          user.password = hashedPassword;
          await user.save();

          console.log(`✅ Reset password for: ${user.name} (${email})`);
          updatedCount++;
        } else {
          console.log(`❌ User not found: ${email}`);
        }
      } catch (error) {
        console.error(
          `❌ Error resetting password for ${email}:`,
          error.message
        );
      }
    }

    console.log(
      `\n🎉 Successfully reset passwords for ${updatedCount} guides!`
    );
    console.log(
      "🔑 You can now login with email: name@example.com and password: password123"
    );

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("💥 Error connecting to database:", error.message);
    process.exit(1);
  }
};

// Run the script
resetGuidePasswords();
