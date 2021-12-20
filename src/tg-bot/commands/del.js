module.exports = async (ctx) => {
  const { reply_to_message: original } = ctx.message;
  const { vk, chat, photo } = ctx.state;

  if (!photo) {
    return ctx.reply(
      `Команда /del используется в ответе на сообщение с фото.\nсм. инструкцию`
    );
  }

  const { message_id } = original;

  const photoInfo = chat.photos.find((p) => p.message_id === message_id);
  if (photoInfo) {
    return vk.api.photos
      .delete({
        owner_id: photoInfo.owner_id,
        photo_id: photoInfo.photo_id,
      })
      .then(() => {
        ctx.reply(`\ud83d\udc4d`, {
          reply_to_message_id: message_id,
        });
      })
      .catch((error) => {
        ctx.reply(`Не удалось удалить данное фото.\n${error.message}`, {
          reply_to_message_id: message_id,
        });
      });
  }
  return ctx.reply(`Невозможно удалить данное фото.`, {
    reply_to_message_id: message_id,
  });
};
