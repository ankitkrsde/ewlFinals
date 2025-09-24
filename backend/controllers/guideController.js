const GuideProfile = require("../models/GuideProfile");
const User = require("../models/User");
const Review = require("../models/Review");

// @desc    Get all guides
// @route   GET /api/guides
// @access  Public
exports.getGuides = async (req, res, next) => {
  try {
    // Filtering
    let query;
    let queryStr = JSON.stringify({ ...req.query });
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = GuideProfile.find(JSON.parse(queryStr))
      .populate("userId", "name email avatar phone location languages")
      .where("verificationStatus")
      .equals("approved")
      .where("isAvailable")
      .equals(true);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-rating.average");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await GuideProfile.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const guides = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: guides.length,
      pagination,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single guide
// @route   GET /api/guides/:id
// @access  Public
exports.getGuide = async (req, res, next) => {
  try {
    const guide = await GuideProfile.findById(req.params.id)
      .populate("userId", "name email avatar phone location languages")
      .populate("featuredGuides");

    if (!guide) {
      return res.status(404).json({
        success: false,
        message: "Guide not found",
      });
    }

    // Get reviews for this guide
    const reviews = await Review.find({ guideId: guide.userId._id })
      .populate("touristId", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        guide,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update guide profile
// @route   POST /api/guides
// @route   PUT /api/guides/:id
// @access  Private/Guide
exports.createUpdateGuideProfile = async (req, res, next) => {
  try {
    // Check if user is a guide
    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can create/update guide profiles",
      });
    }

    let guideProfile = await GuideProfile.findOne({ userId: req.user.id });

    if (guideProfile) {
      // Update existing profile
      guideProfile = await GuideProfile.findOneAndUpdate(
        { userId: req.user.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("userId", "name email avatar");

      res.status(200).json({
        success: true,
        data: guideProfile,
      });
    } else {
      // Create new profile
      guideProfile = await GuideProfile.create({
        userId: req.user.id,
        ...req.body,
      });

      await guideProfile.populate("userId", "name email avatar");

      res.status(201).json({
        success: true,
        data: guideProfile,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get guides by city
// @route   GET /api/guides/city/:city
// @access  Public
exports.getGuidesByCity = async (req, res, next) => {
  try {
    const guides = await GuideProfile.find({
      cities: { $regex: req.params.city, $options: "i" },
      verificationStatus: "approved",
      isAvailable: true,
    })
      .populate("userId", "name email avatar languages")
      .sort("-rating.average");

    res.status(200).json({
      success: true,
      count: guides.length,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's guide profile
// @route   GET /api/guides/me
// @access  Private/Guide
exports.getMyGuideProfile = async (req, res, next) => {
  try {
    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can access this resource",
      });
    }

    const guideProfile = await GuideProfile.findOne({
      userId: req.user.id,
    }).populate("userId", "name email avatar phone location languages");

    if (!guideProfile) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: guideProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guide availability
// @route   PUT /api/guides/availability
// @access  Private/Guide
exports.updateAvailability = async (req, res, next) => {
  try {
    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Only guides can update availability",
      });
    }

    const guideProfile = await GuideProfile.findOneAndUpdate(
      { userId: req.user.id },
      {
        availability: req.body.availability,
        isAvailable: req.body.isAvailable,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: guideProfile,
    });
  } catch (error) {
    next(error);
  }
};
