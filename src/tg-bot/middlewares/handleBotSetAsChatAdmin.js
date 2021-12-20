const inlineKeyboards = require('../keyboards/inlineKeyboards');

module.exports = (ctx, next) => {
  const updates = ctx.update ? ctx.update.my_chat_member : null;
  if (!updates) {
    return next();
  }

  const { new_chat_member } = updates;
  if (!new_chat_member) {
    return next();
  }

  if (
    new_chat_member.user.id === +process.env.BOT_ID &&
    new_chat_member.status === 'administrator'
  ) {
    ctx.reply(
      'Отлично! Теперь Вы можете предоставить мне полный доступ к фото',
      inlineKeyboards.fullToken
    );
    return next();
  }
  next();
};
