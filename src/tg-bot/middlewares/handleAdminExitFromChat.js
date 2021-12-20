const Chat = require('../../models/chat');

module.exports = async (ctx, next) => {
  if (!ctx.message) {
    return next();
  }
  const { left_chat_member, left_chat_participant } = ctx.message;
  const user = left_chat_member || left_chat_participant;
  if (!user) {
    return next();
  }
  const chatId = ctx.chat.id;
  const chat = await Chat.findOne({ chatId });
  if (!chat) {
    return next();
  }
  await chat.populate({ path: `admin` }).execPopulate();

  if (user && user.id === chat.admin.tgId) {
    await Chat.deleteOne({
      _id: chat._id,
    });
    return ctx.reply(
      `Администратор покинул чат и я сбросил все настройки.\nИспользуйте команду /start для продолжения.`
    );
  }
};
