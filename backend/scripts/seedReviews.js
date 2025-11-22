const mongoose = require("mongoose");
const Review = require("../models/Review");
const User = require("../models/User");

const seedReviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected for seeding reviews");

    // Clear existing reviews
    await Review.deleteMany({});
    console.log("Existing reviews cleared");

    // Get some users to use as tourists and guides
    const users = await User.find().limit(10);

    if (users.length < 4) {
      console.log(
        "Not enough users to create reviews. Please create users first."
      );
      process.exit(1);
    }

    const sampleReviews = [
      {
        touristId: users[0]._id,
        guideId: users[1]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 4.8,
          knowledge: 5,
          communication: 4,
          punctuality: 5,
        },
        comment:
          "Rajesh showed us hidden gems in Delhi that we would never have found on our own. His knowledge of local history was impressive! The tour was well-paced and he answered all our questions patiently.",
        isApproved: true,
      },
      {
        touristId: users[2]._id,
        guideId: users[3]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 5.0,
          knowledge: 5,
          communication: 5,
          punctuality: 5,
        },
        comment:
          "Meera took us to the most incredible street food spots in Mumbai. We tasted authentic local flavors and learned so much about the city's culinary culture. Highly recommended for food lovers!",
        isApproved: true,
      },
      {
        touristId: users[4]._id,
        guideId: users[1]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 4.7,
          knowledge: 5,
          communication: 4,
          punctuality: 4,
        },
        comment:
          "Vikram's spiritual tour of Varanasi was transformative. He explained the rituals with such depth and respect. The evening Ganga Aarti was magical with his explanations.",
        isApproved: true,
      },
      {
        touristId: users[5]._id,
        guideId: users[3]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 4.9,
          knowledge: 5,
          communication: 5,
          punctuality: 4,
        },
        comment:
          "Arun planned the perfect mix of beach relaxation and adventure activities in Goa. His local connections got us the best experiences at reasonable prices!",
        isApproved: true,
      },
      {
        touristId: users[6]._id,
        guideId: users[1]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 4.6,
          knowledge: 5,
          communication: 4,
          punctuality: 4,
        },
        comment:
          "Meera's knowledge of Jaipur's royal history brought the palaces to life. She even helped us get great deals at local markets and suggested the best places for traditional handicrafts.",
        isApproved: true,
      },
      {
        touristId: users[7]._id,
        guideId: users[3]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 4.8,
          knowledge: 4,
          communication: 5,
          punctuality: 5,
        },
        comment:
          "Amazing photography tour! The guide knew all the perfect spots for capturing Kerala's backwaters. The light was perfect and we got incredible photos.",
        isApproved: true,
      },
      {
        touristId: users[8]._id,
        guideId: users[1]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 4.5,
          knowledge: 4,
          communication: 5,
          punctuality: 4,
        },
        comment:
          "Great cultural immersion experience. The guide was very flexible and adjusted the tour based on our interests. Learned a lot about local traditions.",
        isApproved: true,
      },
      {
        touristId: users[9]._id,
        guideId: users[3]._id,
        bookingId: new mongoose.Types.ObjectId(),
        rating: {
          overall: 5.0,
          knowledge: 5,
          communication: 5,
          punctuality: 5,
        },
        comment:
          "Absolutely fantastic! The guide went above and beyond to make our experience memorable. We felt like we were exploring with a knowledgeable friend rather than a tour guide.",
        isApproved: true,
      },
    ];

    // Insert sample reviews
    await Review.insertMany(sampleReviews);
    console.log("Sample reviews seeded successfully");

    // Count and display results
    const reviewCount = await Review.countDocuments();
    console.log(`Total reviews in database: ${reviewCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding reviews:", error);
    process.exit(1);
  }
};

// Run the seeder
seedReviews();
