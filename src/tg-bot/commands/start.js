const User = require('../../models/user');
const Chat = require('../../models/chat');
const inlineKeyboards = require('../keyboards/inlineKeyboards');

const handleStart = async (ctx, isNewChat) => {
  const tgId = ctx.from.id;
  const chatId = ctx.chat.id;

  let user = await User.findOne({ tgId });

  if (!user) {
    user = new User({
      tgId,
      tgName: ctx.from.first_name,
    });
    await user.save();
  }

  const chat = isNewChat
    ? new Chat({
        admin: user,
        chatId,
        disabled: false,
      })
    : await Chat.findOne({ chatId });

  chat.admin = user;
  await chat.save();

  if (user.vkAccess.token) {
    return ctx.reply(
      `Привет ${user.tgName}!\nЕсли нужна инструкция, используйте команду /help`
    );
  }

  return ctx.reply(
    `Для работы мне потребуется доступ к Вашим фотографиям в Vk\n\nЕсть 2 варианта доступа:\n\n1. Частичный доступ\nПозволит Вам добавлять фотографии из Telegram чата в Vk альбом\n\n2. Полный доступ\nПозволит также и УДАЛЯТЬ фотографии в Vk прямо из Telegram чата.\n\nВыберите нужный вариант:`,
    inlineKeyboards.chouseToken
  );
};

module.exports = handleStart;
