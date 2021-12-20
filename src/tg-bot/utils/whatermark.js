const Jimp = require('jimp');

const LOGO_MARGIN_PERCENTAGE = 0.5;

const whatermark = async (originalImage, whatermarkLogo) => {
  const [image, logo] = await Promise.all([
    Jimp.read(originalImage),
    Jimp.read(whatermarkLogo),
  ]);

  const { width, height } = image.bitmap;

  if (width > height) {
    logo.resize(width / 6, Jimp.AUTO);
  } else {
    logo.resize(width / 4, Jimp.AUTO);
  }

  const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
  const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;

  const X = image.bitmap.width - logo.bitmap.width - xMargin;
  const Y = image.bitmap.height - logo.bitmap.height - yMargin;

  return image.composite(logo, X, Y);
};

module.exports = whatermark;
