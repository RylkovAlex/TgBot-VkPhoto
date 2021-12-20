module.exports = async (ctx) => {
  const { chat } = ctx.state;
  chat.disabled = false;
  await chat.save();
  ctx.reply(`Бот активен`);
  return ctx.answerCbQuery(`Бот активен`);
};
