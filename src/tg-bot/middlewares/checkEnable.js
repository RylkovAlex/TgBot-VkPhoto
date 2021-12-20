const inlineKeyboards = require('../keyboards/inlineKeyboards');

module.exports = (ctx, next) => {
  const { chat } = ctx.state;

  if (chat.disabled) {
    return ctx.reply(`Бот отключен`, inlineKeyboards.enableBot);
  }

  next();
};
