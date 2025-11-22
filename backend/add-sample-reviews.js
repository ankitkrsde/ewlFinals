const mongoose = require("mongoose");
const Review = require("./models/Review");
const User = require("./models/User");
const Booking = require("./models/Booking");
const GuideProfile = require("./models/GuideProfile");
require("dotenv").config();

const sampleReviews = [
  {
    touristName: "Priya Sharma",
    touristEmail: "priya.sharma@example.com",
    rating: {
      overall: 4.8,
      knowledge: 5,
      communication: 4.5,
      punctuality: 5,
    },
    comment:
      "The guide showed us hidden gems in Delhi that we would never have found on our own. His knowledge of local history was impressive and he was always punctual. Highly recommended!",
    location: "Mumbai, India",
  },
  {
    touristName: "Arun Kumar",
    touristEmail: "arun.kumar@example.com",
    rating: {
      overall: 5.0,
      knowledge: 5,
      communication: 5,
      punctuality: 5,
    },
    comment:
      "Best food tour experience! We tasted authentic local flavors and learned so much about the cuisine. The guide's recommendations were spot on!",
    location: "Bangalore, India",
  },
  {
    touristName: "Sarah Johnson",
    touristEmail: "sarah.johnson@example.com",
    rating: {
      overall: 4.7,
      knowledge: 5,
      communication: 4.5,
      punctuality: 4.5,
    },
    comment:
      "The cultural tour was absolutely transformative. Our guide explained everything with such depth and respect. As a foreign traveler, I felt completely safe and learned so much.",
    location: "London, UK",
  },
  {
    touristName: "Mike Chen",
    touristEmail: "mike.chen@example.com",
    rating: {
      overall: 4.9,
      knowledge: 5,
      communication: 4.5,
      punctuality: 5,
    },
    comment:
      "Perfect mix of relaxation and adventure activities! The guide's local connections got us the best experiences. Will definitely book again!",
    location: "Singapore",
  },
  {
    touristName: "Anita Patel",
    touristEmail: "anita.patel@example.com",
    rating: {
      overall: 4.6,
      knowledge: 4.5,
      communication: 5,
      punctuality: 4.5,
    },
    comment:
      "The knowledge of royal history brought everything to life. Our guide was very patient and helped us get great deals at local markets!",
    location: "Ahmedabad, India",
  },
  {
    touristName: "Rajesh Nair",
    touristEmail: "rajesh.nair@example.com",
    rating: {
      overall: 4.8,
      knowledge: 4.5,
      communication: 5,
      punctuality: 5,
    },
    comment:
      "Excellent photography guidance! The guide knew all the best spots for photos and helped us capture amazing memories. Great for couples!",
    location: "Chennai, India",
  },
  {
    touristName: "Lisa Wang",
    touristEmail: "lisa.wang@example.com",
    rating: {
      overall: 4.9,
      knowledge: 5,
      communication: 4.5,
      punctuality: 5,
    },
    comment:
      "The wildlife safari was incredible! Our guide spotted animals we would have missed and explained their behavior beautifully. A must-do experience!",
    location: "Hong Kong",
  },
  {
    touristName: "David Brown",
    touristEmail: "david.brown@example.com",
    rating: {
      overall: 4.7,
      knowledge: 5,
      communication: 4,
      punctuality: 5,
    },
    comment:
      "The heritage walk through ancient temples was fascinating. The storytelling made history come alive. A truly educational and enjoyable experience.",
    location: "Sydney, Australia",
  },
];

// Different tour types for variety
const tourTypes = [
  "Historical Tour",
  "Food Tour",
  "Cultural Experience",
  "Adventure Trip",
  "Photography Walk",
  "Wildlife Safari",
  "Spiritual Journey",
  "Shopping Guide",
];

const getRandomTourType = () => {
  return tourTypes[Math.floor(Math.random() * tourTypes.length)];
};

const getRandomDate = (daysBack = 90) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

const addSampleReviews = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Get all verified guides from the database
    const guideProfiles = await GuideProfile.find({
      verificationStatus: "approved",
    }).populate("userId");

    if (guideProfiles.length === 0) {
      console.log("❌ No verified guides found in database!");
      console.log(
        "💡 Please make sure you have guides with approved verification status"
      );
      await mongoose.connection.close();
      return;
    }

    console.log(`📊 Found ${guideProfiles.length} verified guides in database`);

    let reviewsAdded = 0;

    for (let i = 0; i < sampleReviews.length; i++) {
      const reviewData = sampleReviews[i];

      try {
        // Use different guides for each review (cycle through available guides)
        const guideProfile = guideProfiles[i % guideProfiles.length];
        const guide = guideProfile.userId;

        // Find or create tourist user
        let tourist = await User.findOne({ email: reviewData.touristEmail });
        if (!tourist) {
          tourist = await User.create({
            name: reviewData.touristName,
            email: reviewData.touristEmail,
            password:
              "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
            role: "tourist",
            location: {
              city: reviewData.location.split(",")[0],
              country: reviewData.location.split(",")[1]?.trim() || "India",
            },
          });
          console.log(`✅ Created tourist: ${tourist.name}`);
        }

        // Calculate price using the guide's hourly rate
        const duration = 3 + Math.floor(Math.random() * 4); // 3-6 hours
        const price = guideProfile.hourlyRate * duration;

        // Create a sample completed booking for this review
        const bookingDate = getRandomDate();
        const booking = await Booking.create({
          touristId: tourist._id,
          guideId: guide._id,
          date: bookingDate,
          duration: duration,
          startTime: ["09:00", "10:00", "14:00", "15:00"][
            Math.floor(Math.random() * 4)
          ],
          meetingPoint: [
            "Hotel Lobby",
            "City Center",
            "Train Station",
            "Main Square",
          ][Math.floor(Math.random() * 4)],
          numberOfPeople: 1 + Math.floor(Math.random() * 4), // 1-4 people
          status: "completed",
          price: price,
          specialRequests: `Looking forward to the ${getRandomTourType().toLowerCase()}!`,
        });

        console.log(
          `✅ Created booking: ${tourist.name} → ${guide.name} (${duration}h, ₹${price})`
        );

        // Create the review
        const review = await Review.create({
          touristId: tourist._id,
          guideId: guide._id,
          bookingId: booking._id,
          rating: reviewData.rating,
          comment: reviewData.comment,
          isApproved: true,
        });

        console.log(
          `⭐ Added review: ${tourist.name} for ${guide.name} - Rating: ${reviewData.rating.overall}/5`
        );
        reviewsAdded++;
      } catch (error) {
        console.error(
          `❌ Error creating review for ${reviewData.touristName}:`,
          error.message
        );
      }
    }

    console.log(`\n🎉 SUCCESS: Added ${reviewsAdded} sample reviews!`);
    console.log(
      "🏠 Your homepage reviews section should now show real traveler reviews"
    );
    console.log(
      "👥 Used guides from your database:",
      guideProfiles.map((g) => g.userId.name).join(", ")
    );

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("💥 Error connecting to database:", error.message);
    process.exit(1);
  }
};

// Run the script
addSampleReviews();
