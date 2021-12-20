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
    vkAccess: {
      token: {
        type: String,
        trim: true,
      },
      isFull: {
        type: Boolean,
      },
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
