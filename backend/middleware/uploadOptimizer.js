const sharp = require("sharp");

const optimizeImage = async (buffer, maxWidth = 800, quality = 80) => {
  return await sharp(buffer).resize(maxWidth).jpeg({ quality }).toBuffer();
};

module.exports = optimizeImage;
