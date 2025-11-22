const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const sampleTourists = [
  {
    name: "Rahul Kumar",
    email: "rahul.tourist@example.com",
    password: "password123",
    role: "tourist",
    phone: "+919876543218",
    location: {
      city: "Delhi",
      country: "India",
    },
  },
  {
    name: "Priya Sharma",
    email: "priya.tourist@example.com",
    password: "password123",
    role: "tourist",
    phone: "+919876543219",
    location: {
      city: "Mumbai",
      country: "India",
    },
  },
  {
    name: "Alex Johnson",
    email: "alex.tourist@example.com",
    password: "password123",
    role: "tourist",
    phone: "+441234567890",
    location: {
      city: "London",
      country: "UK",
    },
  },
];

const addSampleTourists = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    let touristsAdded = 0;

    for (const touristData of sampleTourists) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: touristData.email });
        if (existingUser) {
          console.log(`⚠️ User ${touristData.email} already exists`);
          continue;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(touristData.password, salt);

        // Create user
        const user = await User.create({
          ...touristData,
          password: hashedPassword,
        });

        console.log(`✅ Created tourist: ${user.name} (${user.email})`);
        touristsAdded++;
      } catch (error) {
        console.error(
          `❌ Error creating tourist ${touristData.name}:`,
          error.message
        );
      }
    }

    console.log(`\n🎉 Successfully added ${touristsAdded} sample tourists!`);
    console.log("🔑 Login credentials:");
    sampleTourists.forEach((tourist) => {
      console.log(`   📧 ${tourist.email} | 🔐 password123`);
    });

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("💥 Error connecting to database:", error.message);
    process.exit(1);
  }
};

// Run the script
addSampleTourists();
