const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // для связи с другой моделью
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
