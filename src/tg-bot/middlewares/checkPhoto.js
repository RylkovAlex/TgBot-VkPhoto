const MAX_FILE_SIZE = 2e7;
const AVALIBLE_MIME_TYPES = [
  `image/jpeg`,
  `image/pjpeg`,
  `image/gif`,
  `image/png`,
];

const checkPhoto = (place) => async (ctx, next) => {
  const { message, editedMessage } = ctx;
  let data = message || editedMessage;

  if (place === 'inOriginal') {
    data = data.reply_to_message;
    if (!data) {
      return ctx.reply('Ошибка в использовании команды.\nПрочитайте инструкцию: /help')
    }
  }

  if (place === 'inCbQuery') {
    data = ctx.callbackQuery.message.reply_to_message;
  }

  const { message_id } = data;
  const photos = data.photo;
  const { document } = data;
  const { caption } = data;

  if (photos) {
    ctx.state.photo = photos.filter((p) => p.file_size <= MAX_FILE_SIZE).pop();
    ctx.state.photo.caption = caption;
    return next();
  }

  if (document && AVALIBLE_MIME_TYPES.includes(document.mime_type)) {
    if (document.file_size > MAX_FILE_SIZE) {
      return ctx.reply(`Превышен максимальный размер фото (20Mb)`, {
        reply_to_message_id: message_id,
      });
    }
    ctx.state.photo = document;
    ctx.state.photo.caption = caption;
    return next();
  }
};

module.exports = checkPhoto;
