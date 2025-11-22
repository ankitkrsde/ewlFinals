const mongoose = require("mongoose");
require("dotenv").config();

// Load all models
const User = require("./models/User");
const GuideProfile = require("./models/GuideProfile");
const Booking = require("./models/Booking");
const Review = require("./models/Review");
const Message = require("./models/Message");

const cleanDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Delete all data from collections (in correct order to respect foreign keys)
    console.log("🗑️ Starting database cleanup...");

    // Delete in reverse dependency order
    const messagesDeleted = await Message.deleteMany({});
    console.log(`🗑️ Deleted ${messagesDeleted.deletedCount} messages`);

    const reviewsDeleted = await Review.deleteMany({});
    console.log(`🗑️ Deleted ${reviewsDeleted.deletedCount} reviews`);

    const bookingsDeleted = await Booking.deleteMany({});
    console.log(`🗑️ Deleted ${bookingsDeleted.deletedCount} bookings`);

    const guideProfilesDeleted = await GuideProfile.deleteMany({});
    console.log(
      `🗑️ Deleted ${guideProfilesDeleted.deletedCount} guide profiles`
    );

    const usersDeleted = await User.deleteMany({});
    console.log(`🗑️ Deleted ${usersDeleted.deletedCount} users`);

    console.log("\n🎉 Database cleanup completed successfully!");
    console.log("📊 Summary:");
    console.log(`   👥 Users: ${usersDeleted.deletedCount}`);
    console.log(`   🎯 Guide Profiles: ${guideProfilesDeleted.deletedCount}`);
    console.log(`   📅 Bookings: ${bookingsDeleted.deletedCount}`);
    console.log(`   ⭐ Reviews: ${reviewsDeleted.deletedCount}`);
    console.log(`   💬 Messages: ${messagesDeleted.deletedCount}`);

    console.log(
      "\n🚀 Your database is now clean and ready for fresh registrations!"
    );

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("💥 Error cleaning database:", error.message);
    process.exit(1);
  }
};

// Run the cleanup
cleanDatabase();
