const inlineKeyboards = require('../keyboards/inlineKeyboards');

const checkFullAccess = async (ctx, next) => {
  const { user } = ctx.state;
  if (!user.vkAccess.isFull) {
    return ctx.reply(
      `Для выполнения данной команды необходим полный доступ к Вашим фотографиям в Vk.`,
      inlineKeyboards.fullToken
    );
  }

  return next();
};

module.exports = checkFullAccess;
