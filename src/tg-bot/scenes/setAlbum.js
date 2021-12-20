const {
  Scenes: { BaseScene },
} = require('telegraf');
const scenes = require('./scenes');
const keyboards = require('../keyboards/keyboards');
const buttons = require('../keyboards/buttons');

const setAlbumScene = new BaseScene(scenes.setAlbumScene);

setAlbumScene.enter((ctx) => {
  ctx.reply(`Введите ссылку на льбом`, keyboards.exit_keyboard);
});

setAlbumScene.on(`text`, async (ctx) => {
  const { text } = ctx.message;
  const expression =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);

  if (text.match(regex) && text.includes(`album`)) {
    const albumMeta = text.split(`album`).pop();
    let [owner_id, album_id] = albumMeta.split(`_`);
    owner_id = Number.parseInt(owner_id, 10);
    album_id = Number.parseInt(album_id, 10);

    if (album_id === 0) {
      return ctx.reply(
        `В данный альбом невозможно загружать фото! Попробуйте другую ссылку.`
      );
    }

    const { vk } = ctx.state;
    const group_id = owner_id < 0 ? Math.abs(owner_id) : null;
    ctx.state.chat.vkAlbum.group_id = group_id;

    const options = {
      album_id,
    };

    if (group_id) {
      options.group_id = group_id;
    }

    try {
      const response = await vk.api.photos.getUploadServer(options);
      ctx.state.chat.vkAlbum = {
        ...ctx.state.chat.vkAlbum,
        album_id: response.album_id,
        upload_url: response.upload_url,
        album_link: text,
      };
      await ctx.state.chat.save();
      return ctx.scene.leave();
    } catch (error) {
      if (error.code === 203) {
        return ctx.reply(
          `У Вас нет доступа для редактирвания этого альбома.\nЗапросите доступ или попробуйте другую ссылку.`,
          keyboards.exit_keyboard
        );
      }
      return ctx.reply(`Ошибка! ${error.message}/n`);
    }
  } else {
    return ctx.reply(
      `Неправильный формат ссылки!\nПопробуйте ещё раз:`,
      keyboards.exit_keyboard
    );
  }
});

setAlbumScene.leave((ctx) => {
  if (ctx.message.text === buttons.cancel) {
    return ctx.reply(`Команда отменена.`, keyboards.remove_keyboard);
  }
  return ctx.reply(
    `Альбом для загрузки фотографий установлен.`,
    keyboards.remove_keyboard
  );
});

module.exports = setAlbumScene;
