const inlineKeyboards = require('../keyboards/inlineKeyboards');

module.exports = async (ctx) => {
  const { chat } = ctx.state;
  chat.disabled = true;
  await chat.save();
  return ctx.reply(`Бот отключен`, inlineKeyboards.enableBot);
};
