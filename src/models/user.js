const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    tgName: {
      type: String,
      required: true,
      trim: true,
    },
    tgId: {
      type: Number,
      trim: true,
    },
    vkName: {
      type: String,
      trim: true,
    },
    vkId: {
      type: Number,
      trim: true,
    },
    vkAccessToken: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
