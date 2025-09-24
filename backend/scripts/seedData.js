// This file will add sample data to our database for testing

// 1. Import required modules
const mongoose = require("mongoose");
const User = require("../models/User");
const GuideProfile = require("../models/GuideProfile");
const City = require("../models/City");
const dotenv = require("dotenv");

// 2. Load environment variables from .env file
dotenv.config();

// 3. This is our main function that will run
const seedData = async () => {
  try {
    console.log("🌱 Starting to add sample data...");

    // 4. Connect to MongoDB database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB database");

    // 5. CLEAN UP: Delete all existing data first
    console.log("🧹 Cleaning up old data...");
    await User.deleteMany();
    await GuideProfile.deleteMany();
    await City.deleteMany();
    console.log("✅ Old data cleaned up");

    // 6. CREATE SAMPLE CITIES
    console.log("🏙️ Creating sample cities...");
    const cities = await City.insertMany([
      {
        name: "Delhi",
        state: "Delhi",
        description: "Capital city of India with rich historical heritage",
        popularAttractions: ["Red Fort", "India Gate", "Qutub Minar"],
      },
      {
        name: "Mumbai",
        state: "Maharashtra",
        description: "Financial capital with bustling city life",
        popularAttractions: [
          "Gateway of India",
          "Marine Drive",
          "Elephanta Caves",
        ],
      },
      {
        name: "Jaipur",
        state: "Rajasthan",
        description: "Pink City known for its palaces and vibrant culture",
        popularAttractions: ["Hawa Mahal", "Amber Fort", "City Palace"],
      },
      {
        name: "Goa",
        state: "Goa",
        description: "Beautiful beaches and Portuguese heritage",
        popularAttractions: [
          "Calangute Beach",
          "Basilica of Bom Jesus",
          "Dudhsagar Falls",
        ],
      },
      {
        name: "Agra",
        state: "Uttar Pradesh",
        description: "Home to the magnificent Taj Mahal",
        popularAttractions: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri"],
      },
    ]);
    console.log("✅ Created", cities.length, "cities");

    // 7. CREATE SAMPLE TOURIST USER
    console.log("👤 Creating sample tourist user...");
    const tourist = await User.create({
      name: "Rahul Sharma",
      email: "rahul.tourist@example.com",
      password: "123456",
      role: "tourist",
      phone: "9876543210",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
      },
      languages: ["Hindi", "English"],
    });
    console.log("✅ Tourist user created:", tourist.email);

    // 8. CREATE SAMPLE GUIDE USER (DELHI GUIDE)
    console.log("🧳 Creating Delhi guide user...");
    const delhiGuideUser = await User.create({
      name: "Priya Singh",
      email: "priya.guide@example.com",
      password: "123456",
      role: "guide",
      phone: "9876543211",
      location: {
        city: "Delhi",
        state: "Delhi",
        country: "India",
      },
      languages: ["Hindi", "English", "Punjabi"],
    });
    console.log("✅ Delhi guide user created:", delhiGuideUser.email);

    // 9. CREATE DELHI GUIDE PROFILE
    console.log("📋 Creating Delhi guide profile...");
    const delhiGuideProfile = await GuideProfile.create({
      userId: delhiGuideUser._id,
      bio: "Experienced local guide with 5 years of experience showing tourists around Delhi. I love sharing the rich history and culture of our city!",
      specialties: ["Historical", "Cultural", "Food"], // USING ALLOWED SPECIALTIES
      experience: 5,
      hourlyRate: 600,
      cities: ["Delhi", "New Delhi"],
      languages: ["Hindi", "English", "Punjabi"],
      documents: {
        idProof: "uploads/id_proof_priya.pdf",
        addressProof: "uploads/address_proof_priya.pdf",
        verificationPhoto: "uploads/verification_photo_priya.jpg",
      },
      verificationStatus: "approved",
      rating: {
        average: 4.7,
        count: 23,
        breakdown: {
          knowledge: 4.8,
          communication: 4.6,
          punctuality: 4.9,
        },
      },
      isAvailable: true,
      portfolio: [
        {
          image: "uploads/portfolio1_priya.jpg",
          caption: "Guiding tourists at Red Fort",
        },
        {
          image: "uploads/portfolio2_priya.jpg",
          caption: "Local food tour in Old Delhi",
        },
      ],
    });
    console.log("✅ Delhi guide profile created for:", delhiGuideUser.name);

    // 10. CREATE GOA GUIDE USER
    console.log("🧳 Creating Goa guide user...");
    const goaGuideUser = await User.create({
      name: "Arun Kumar",
      email: "arun.guide@example.com",
      password: "123456",
      role: "guide",
      phone: "9876543212",
      location: {
        city: "Goa",
        state: "Goa",
        country: "India",
      },
      languages: ["Hindi", "English", "Other"], // Using "Other" since Konkani not in list
    });
    console.log("✅ Goa guide user created:", goaGuideUser.email);

    // 11. CREATE GOA GUIDE PROFILE (WITH CORRECTED SPECIALTIES)
    console.log("📋 Creating Goa guide profile...");
    const goaGuideProfile = await GuideProfile.create({
      userId: goaGuideUser._id,
      bio: "Goa local expert! I can show you hidden beaches, best seafood spots, and Portuguese heritage sites.",
      specialties: ["Adventure", "Nature", "Cultural"], // FIXED: Using allowed specialties
      experience: 3,
      hourlyRate: 500,
      cities: ["Goa", "North Goa", "South Goa"],
      languages: ["Hindi", "English", "Other"],
      documents: {
        idProof: "uploads/id_proof_arun.pdf",
        addressProof: "uploads/address_proof_arun.pdf",
        verificationPhoto: "uploads/verification_photo_arun.jpg",
      },
      verificationStatus: "approved",
      rating: {
        average: 4.9,
        count: 15,
        breakdown: {
          knowledge: 4.8,
          communication: 5.0,
          precision: 4.9,
        },
      },
      isAvailable: true,
      portfolio: [
        {
          image: "uploads/portfolio1_arun.jpg",
          caption: "Beach hopping tour",
        },
      ],
    });
    console.log("✅ Goa guide profile created for:", goaGuideUser.name);

    // 12. CREATE ADMIN USER
    console.log("👨‍💼 Creating admin user...");
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@explorewithlocals.com",
      password: "admin123",
      role: "admin",
      phone: "9876543213",
      location: {
        city: "Delhi",
        state: "Delhi",
        country: "India",
      },
      languages: ["Hindi", "English"],
    });
    console.log("✅ Admin user created:", adminUser.email);

    // 13. SUCCESS MESSAGE
    console.log("\n🎉 SAMPLE DATA CREATED SUCCESSFULLY!");
    console.log("=====================================");
    console.log("📊 Summary:");
    console.log("   🏙️  Cities:", cities.length);
    console.log("   👤 Users:", 3 + " (1 tourist, 2 guides, 1 admin)");
    console.log("   🧳 Guide Profiles: 2");
    console.log("\n🔑 Test Login Credentials:");
    console.log("   Tourist: rahul.tourist@example.com / 123456");
    console.log("   Delhi Guide: priya.guide@example.com / 123456");
    console.log("   Goa Guide: arun.guide@example.com / 123456");
    console.log("   Admin: admin@explorewithlocals.com / admin123");
    console.log(
      "\n💡 Allowed Specialties: Historical, Cultural, Food, Adventure, Spiritual, Nature, Photography, Shopping, Architecture, Wildlife"
    );
    console.log(
      "💡 Allowed Languages: Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Malayalam, Kannada, Other"
    );
    console.log("\n🚀 You can now test your application!");

    // 14. Close database connection
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    // 15. If anything goes wrong, show the error
    console.error("❌ Error creating sample data:", error.message);
    console.log("\n💡 Common Issues:");
    console.log("   - Check if specialties are in allowed list");
    console.log("   - Check if languages are in allowed list");
    console.log("   - Check if all required fields are provided");
    process.exit(1);
  }
};

// 16. Run our function
seedData();
