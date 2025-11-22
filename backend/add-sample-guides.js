const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Load models
const User = require("./models/User");
const GuideProfile = require("./models/GuideProfile");

const sampleGuides = [
  {
    user: {
      name: "Amit Verma",
      email: "amit.verma@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543210",
    },
    profile: {
      bio: "Experienced historical guide specializing in Delhi's rich heritage and monuments. I love sharing stories about Mughal architecture and ancient Indian history.",
      specialties: ["Historical", "Cultural", "Architecture"],
      experience: 8,
      hourlyRate: 800,
      cities: ["Delhi", "Agra", "Jaipur"],
      languages: ["Hindi", "English", "Punjabi"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543211",
    },
    profile: {
      bio: "Food enthusiast and culinary expert showing the best street food and local cuisine. Join me for a gastronomic journey through India's diverse food culture.",
      specialties: ["Food", "Cultural", "Shopping"],
      experience: 5,
      hourlyRate: 700,
      cities: ["Mumbai", "Pune", "Goa"],
      languages: ["Hindi", "English", "Marathi"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Rohan Mehta",
      email: "rohan.mehta@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543212",
    },
    profile: {
      bio: "Adventure guide specializing in trekking, wildlife, and outdoor experiences. Let's explore the Himalayas and create unforgettable memories.",
      specialties: ["Adventure", "Nature", "Wildlife"],
      experience: 6,
      hourlyRate: 900,
      cities: ["Rishikesh", "Manali", "Shimla"],
      languages: ["Hindi", "English"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Priya Singh",
      email: "priya.singh@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543213",
    },
    profile: {
      bio: "Cultural guide with deep knowledge of Indian traditions, festivals, and spiritual practices. Experience the real India with me.",
      specialties: ["Cultural", "Spiritual", "Historical"],
      experience: 7,
      hourlyRate: 750,
      cities: ["Varanasi", "Haridwar", "Amritsar"],
      languages: ["Hindi", "English", "Punjabi"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Karan Malhotra",
      email: "karan.malhotra@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543214",
    },
    profile: {
      bio: "Professional photographer and guide helping you capture the best moments of your Indian journey. Perfect for Instagram-worthy shots!",
      specialties: ["Photography", "Cultural", "Architecture"],
      experience: 4,
      hourlyRate: 850,
      cities: ["Jaipur", "Udaipur", "Jodhpur"],
      languages: ["Hindi", "English"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Neha Gupta",
      email: "neha.gupta@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543215",
    },
    profile: {
      bio: "Wildlife expert and nature lover. Specialized in jungle safaris and bird watching tours across India's national parks.",
      specialties: ["Wildlife", "Nature", "Adventure"],
      experience: 5,
      hourlyRate: 800,
      cities: ["Ranthambore", "Jim Corbett", "Bandhavgarh"],
      languages: ["Hindi", "English"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Vikram Joshi",
      email: "vikram.joshi@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543216",
    },
    profile: {
      bio: "Heritage walk specialist with focus on ancient temples, forts, and historical sites across South India.",
      specialties: ["Historical", "Architecture", "Spiritual"],
      experience: 9,
      hourlyRate: 950,
      cities: ["Chennai", "Bangalore", "Hyderabad"],
      languages: ["Hindi", "English", "Tamil"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
  {
    user: {
      name: "Anjali Reddy",
      email: "anjali.reddy@example.com",
      password: "password123",
      role: "guide",
      avatar: "",
      phone: "+919876543217",
    },
    profile: {
      bio: "Beach and coastal experience expert. From water sports to serene beach walks, discover the coastal beauty of India.",
      specialties: ["Adventure", "Nature", "Beaches"],
      experience: 4,
      hourlyRate: 700,
      cities: ["Goa", "Kerala", "Andaman"],
      languages: ["Hindi", "English", "Telugu"],
      verificationStatus: "approved",
      isAvailable: true,
      documents: {
        idProof: "/uploads/sample-id.jpg",
        addressProof: "/uploads/sample-address.jpg",
        verificationPhoto: "/uploads/sample-photo.jpg",
      },
    },
  },
];

const addSampleGuides = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    let guidesAdded = 0;

    for (const guideData of sampleGuides) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          email: guideData.user.email,
        });
        if (existingUser) {
          console.log(`⚠️ User ${guideData.user.email} already exists`);
          continue;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(guideData.user.password, salt);

        // Create user
        const user = await User.create({
          ...guideData.user,
          password: hashedPassword,
        });
        console.log(`✅ Created user: ${user.name}`);

        // Create guide profile with random ratings
        const guideProfile = await GuideProfile.create({
          userId: user._id,
          ...guideData.profile,
          rating: {
            average: parseFloat((4.3 + Math.random() * 0.7).toFixed(1)),
            count: Math.floor(Math.random() * 40) + 10,
            breakdown: {
              knowledge: parseFloat((4.2 + Math.random() * 0.8).toFixed(1)),
              communication: parseFloat((4.1 + Math.random() * 0.9).toFixed(1)),
              punctuality: parseFloat((4.3 + Math.random() * 0.7).toFixed(1)),
            },
          },
        });

        console.log(`✅ Created guide profile for: ${user.name}`);
        guidesAdded++;
      } catch (error) {
        console.error(
          `❌ Error creating guide ${guideData.user.name}:`,
          error.message
        );
      }
    }

    console.log(`\n🎉 Successfully added ${guidesAdded} sample guides!`);
    console.log(
      "📧 You can login with any guide using: email: name@example.com and password: password123"
    );

    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("💥 Error connecting to database:", error.message);
    process.exit(1);
  }
};

// Run the script
addSampleGuides();
