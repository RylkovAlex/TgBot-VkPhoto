const Chat = require('../../models/chat');

module.exports = async (ctx) => {
  const { chat } = ctx.state;
  await Chat.deleteOne({
    _id: chat._id,
  });
  return ctx.reply(
    `Я сбросил все настройки.\nИспользуйте команду /start для продолжения.`
  );
};
