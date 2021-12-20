const {
  Scenes: { BaseScene },
} = require('telegraf');
const scenes = require('./scenes');
const keyboards = require('../keyboards/keyboards');
const inlineKeyboards = require('../keyboards/inlineKeyboards');
const buttons = require('../keyboards/buttons');
const auth = require('../utils/auth');
const validator = require('../utils/validator');

const setFullTokenScene = new BaseScene(scenes.setFullTokenScene);

setFullTokenScene.enter((ctx) => {
  ctx.replyWithHTML(
    `Для предоставления полного доступа к фото необходимо выполнить несколько шагов:\n\n1. Перейти по <a href="${auth.getFullTokenUrl()}">ссылке</a>\n\n2. Разрешить приложению запрашиваемый доступ к фото\n\n3. Далее Ваш браузер будет переадресован на специальную страницу c <b>url</b>, содержащим токен доступа.\n<b>Вам нужно скопировать ВСЁ содержимое адресной строки браузера и отправить его мне.</b>\n\n<a href="https://telegra.ph/Predostavlenie-polnogo-dostupa-11-28">Инструкция</a>`,
    inlineKeyboards.vkFullTokenLink
  );
  ctx.reply(
    `Отправьте мне всё содержимое адресной строки:`,
    keyboards.exit_keyboard
  );
});

setFullTokenScene.on(`text`, async (ctx) => {
  const { text } = ctx.message;

  ctx.deleteMessage(ctx.message.message_id);

  const matches = text.match(/access_token=(.*?)\&/);
  const token = matches ? matches[1] : null;

  if (validator.isLink(text) && token) {
    const { user } = ctx.state;
    user.vkAccess = {
      token,
      isFull: true,
    };
    await user.save();
    return ctx.scene.leave();
  }
  return ctx.reply(
    `Неправильный формат ссылки!\nПопробуйте ещё раз:`,
    keyboards.exit_keyboard
  );
});

setFullTokenScene.leave((ctx) => {
  if (ctx.message.text === buttons.cancel) {
    return ctx.reply(`Команда отменена.`, keyboards.remove_keyboard);
  }
  return ctx.reply(
    `Отлично! Полный доступ предоставлен.`,
    keyboards.remove_keyboard
  );
});

module.exports = setFullTokenScene;
