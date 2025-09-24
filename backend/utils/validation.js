const validator = require("validator");

// Validate registration data
exports.validateRegistration = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.email = "Please provide a valid email";
  }

  if (!data.password || data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (data.phone && !validator.isMobilePhone(data.phone, "en-IN")) {
    errors.phone = "Please provide a valid Indian phone number";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

// Validate guide profile
exports.validateGuideProfile = (data) => {
  const errors = {};

  if (!data.hourlyRate || data.hourlyRate < 0) {
    errors.hourlyRate = "Hourly rate must be a positive number";
  }

  if (!data.cities || data.cities.length === 0) {
    errors.cities = "Please select at least one city";
  }

  if (!data.languages || data.languages.length === 0) {
    errors.languages = "Please select at least one language";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

// Validate booking data
exports.validateBooking = (data) => {
  const errors = {};

  if (!data.guideId) {
    errors.guideId = "Guide ID is required";
  }

  if (!data.date || !validator.isDate(data.date)) {
    errors.date = "Valid date is required";
  }

  if (!data.startTime) {
    errors.startTime = "Start time is required";
  }

  if (!data.duration || data.duration < 1) {
    errors.duration = "Duration must be at least 1 hour";
  }

  if (!data.meetingPoint || data.meetingPoint.trim().length < 5) {
    errors.meetingPoint = "Meeting point must be at least 5 characters";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
