const inlineKeyboards = require('../keyboards/inlineKeyboards');

const checkBotIsGroupAdmin = async (ctx, next) => {
  const {
    chat: { chatId },
  } = ctx.state;
  if (chatId > 0) {
    return next();
  }

  const admins = await ctx.getChatAdministrators(chatId);
  const bot = admins.find(
    (admin) =>
      admin.user.id === +process.env.BOT_ID && admin.can_delete_messages
  );

  if (bot) {
    return next();
  }

  return ctx.replyWithHTML(
    `Для выполнения этого действия необходиом <a href="https://telegra.ph/Sdelat-bota-administratorom-chata-11-28">включить бота в администраторы чата и выдать разрешение на удаление сообщений в чате.</a>`,
    inlineKeyboards.setBotChatAdmin
  );
};

module.exports = checkBotIsGroupAdmin;
