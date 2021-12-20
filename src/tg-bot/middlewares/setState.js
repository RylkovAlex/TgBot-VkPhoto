const { VK } = require('vk-io');

const User = require('../../models/user');
const Chat = require('../../models/chat');

const handleStart = require('../commands/start');

const getChatAndUser = async (ctx) => {
  const user =
    (await User.findOne({ tgId: ctx.from.id })) ||
    new User({
      tgId: ctx.from.id,
      tgName: ctx.from.first_name,
    });

  const chat = await Chat.findOne({ chatId: ctx.chat.id });

  return { chat, user };
};

const setState = async (ctx, next) => {
  const { chat, user } = await getChatAndUser(ctx);
  const { message } = ctx;
  const text = message ? message.text : null;

  if (!chat) {
    return handleStart(ctx, true);
  }

  if (text && text.includes('/start')) {
    return handleStart(ctx);
  }

  ctx.state = {
    user,
    chat,
  };

  await chat
    .populate({
      path: `admin`,
    })
    .execPopulate();
  if (chat.admin.vkAccess.token) {
    ctx.state.vk = new VK({
      token: chat.admin.vkAccess.token,
      uploadTimeout: 240e3,
    });
  }

  if (ctx.update) {
    ctx.state.cbData = ctx.update.callback_query
      ? ctx.update.callback_query.data
      : null;
  }

  return next();
};

module.exports = setState;
