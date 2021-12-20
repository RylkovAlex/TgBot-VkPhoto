module.exports = (ctx) => {
  const {
    chat: { vkAlbum },
  } = ctx.state;

  if (!vkAlbum.album_link) {
    return ctx.reply(
      `Альбом для загрузки фото не установлен, используйте команду /setAlbum`
    );
  }

  return ctx.reply(vkAlbum.album_link);
};
