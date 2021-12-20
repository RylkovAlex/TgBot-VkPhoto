const {
  Scenes: { BaseScene },
} = require('telegraf');
const Jimp = require('jimp');

const checkPhoto = require('../middlewares/checkPhoto');
const getTgFile = require('../utils/getTgFile');

const scenes = require('./scenes');
const keyboards = require('../keyboards/keyboards');
const buttons = require('../keyboards/buttons');

const setLogoScene = new BaseScene(scenes.setLogoScene);

setLogoScene.enter((ctx) => {
  ctx.reply(
    `Отправьте логотип для вотермарка.\nДопустимые форматы: JPEG, PNG, GIF\nМаксимальный размер файла: 20Мb)`,
    keyboards.exit_keyboard
  );
});

setLogoScene.on(`message`, checkPhoto(), async (ctx) => {
  const { chat } = ctx.state;

  try {
    const fileUrl = await getTgFile.url(ctx.state.photo.file_id);

    const fileBuffer = await Jimp.read(fileUrl).then((i) => {
      const { width } = i.bitmap;
      const { height } = i.bitmap;
      if (width > height && width > 500) {
        return i.resize(500, Jimp.AUTO).getBufferAsync(Jimp.AUTO);
      }
      if (height > width && height > 500) {
        return i.resize(Jimp.AUTO, 500).getBufferAsync(Jimp.AUTO);
      }
      return i.getBufferAsync(Jimp.AUTO);
    });

    chat.logo = fileBuffer;
    await chat.save();
    return ctx.scene.leave();
  } catch (error) {
    return ctx.reply(error.message);
  }
});

setLogoScene.leave((ctx) => {
  if (ctx.message.text === buttons.cancel) {
    return ctx.reply(`Команда отменена.`, keyboards.remove_keyboard);
  }
  return ctx.reply(
    `Логотип для подписи фотографий установлен!`,
    keyboards.remove_keyboard
  );
});

module.exports = setLogoScene;
