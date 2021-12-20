const Jimp = require('jimp');

const whatermark = require('../utils/whatermark');
const commands = require('../commands/commands');
const getTgFile = require('../utils/getTgFile');
const inlineKeyboards = require('../keyboards/inlineKeyboards');
const Loader = require('../utils/loader');

const handlePhoto = async (ctx, next) => {
  // TODO:
  const { message_id } =
    ctx.message || ctx.callbackQuery.message.reply_to_message;

  const {
    photo: { file_id, caption },
    vk,
    chat,
  } = ctx.state;

  const {
    vkAlbum: { album_id, group_id },
  } = chat;

  if (!album_id) {
    return ctx.reply(
      `Альбом для загрузки фото не установлен, используйте команду /setAlbum`
    );
  }

  if (caption && caption.split(' ').includes(commands.skip)) {
    return next();
  }

  const loader = new Loader(ctx, 5000, 'upload_photo');

  try {
    // throw new Error('test');
    const fileUrl = await getTgFile.url(file_id);
    const { logo } = ctx.state.chat;
    const fileBuffer = logo
      ? await whatermark(fileUrl, logo).then((i) => i.getBufferAsync(Jimp.AUTO))
      : await Jimp.read(fileUrl).then((i) => i.getBufferAsync(Jimp.AUTO));

    const options = {
      source: {
        value: fileBuffer,
      },
      album_id,
    };

    if (group_id) {
      options.group_id = group_id;
    }

    const result = await vk.upload.photoAlbum(options);

    const { id: photo_id, ownerId: owner_id } = result[0];
    chat.photos.push({ message_id, photo_id, owner_id });

    await chat.save();
    loader.stop();
    if (ctx.callbackQuery) {
      ctx.answerCbQuery('');
      next();
    }
  } catch (e) {
    loader.stop();

    // eslint-disable-next-line consistent-return
    console.log(e);
    return ctx.reply(
      `Не удалось загрузить данное фото.\nОшибка: ${e.message}`,
      {
        reply_to_message_id: message_id,
        ...inlineKeyboards.repeat,
      }
    );
  }
};

module.exports = handlePhoto;
