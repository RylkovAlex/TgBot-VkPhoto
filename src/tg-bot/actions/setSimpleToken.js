const auth = require('../utils/auth');

module.exports = async (ctx) => {
  const { user, chat } = ctx.state;
  ctx.replyWithHTML(
    `Хороший выбор!\nЧастичный доступ позволит Вам загружать фотографии прямо из Tg чата в альбом Vk, для продолжения перейдите по <a href="${auth.getDialogUrl(
      user.id,
      chat.chatId
    )}">ссылке</a>`
  );
  return ctx.answerCbQuery(`Для продолжения перейдите по ссылке`);
};
