const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    vkAlbum: {
      album_link: {
        type: String,
      },
      album_id: {
        type: Number,
      },
      group_id: {
        type: Number,
      },
      upload_url: {
        type: String,
      },
    },
    photos: [
      {
        message_id: {
          type: Number,
        },
        photo_id: {
          type: Number,
        },
        owner_id: {
          type: Number,
        },
      },
    ],
    logo: {
      type: Buffer,
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
