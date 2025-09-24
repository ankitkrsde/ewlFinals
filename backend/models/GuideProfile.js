const mongoose = require("mongoose");

const guideProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: [1000, "Bio cannot be more than 1000 characters"],
  },
  specialties: [
    {
      type: String,
      enum: [
        "Historical",
        "Cultural",
        "Food",
        "Adventure",
        "Spiritual",
        "Nature",
        "Photography",
        "Shopping",
        "Architecture",
        "Wildlife",
      ],
    },
  ],
  experience: {
    type: Number,
    min: 0,
    default: 0,
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: [0, "Hourly rate cannot be negative"],
  },
  services: [
    {
      name: {
        type: String,
        required: true,
      },
      description: String,
      duration: Number,
      price: Number,
    },
  ],
  availability: [
    {
      day: {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      slots: [
        {
          start: String,
          end: String,
        },
      ],
    },
  ],
  documents: {
    idProof: {
      type: String,
      required: true,
    },
    addressProof: String,
    verificationPhoto: String,
  },
  verificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
    breakdown: {
      knowledge: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 },
    },
  },
  portfolio: [
    {
      image: String,
      caption: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  cities: [
    {
      type: String,
      required: true,
    },
  ],
  languages: [
    {
      type: String,
      enum: [
        "Hindi",
        "English",
        "Tamil",
        "Telugu",
        "Bengali",
        "Marathi",
        "Gujarati",
        "Punjabi",
        "Malayalam",
        "Kannada",
        "Other",
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
guideProfileSchema.index({ userId: 1 });
guideProfileSchema.index({ cities: 1 });
guideProfileSchema.index({ "rating.average": -1 });

// Update updatedAt
guideProfileSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("GuideProfile", guideProfileSchema);
