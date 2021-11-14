const { Telegraf } = require('telegraf');
const { VK } = require('vk-io');
const bot = new Telegraf(process.env.BOT_TOKEN);
const User = require('../models/user');
const Chat = require('../models/chat');

const getAuthDialogUrl = (userId, chatId) =>
  `https://oauth.vk.com/authorize?client_id=${process.env.VK_APP_ID}&display=page&redirect_uri=${process.env.DOMAIN}/vkauth&scope=${process.env.VK_APP_SCOPE}&response_type=code&state=${userId}:${chatId}&v=5.131`;

const changeChatAdmin = async (chatId, newAdmin) => {
  const chat = await Chat.findOne({ chatId });

  if (chat && chat.admin !== newAdmin) {
    chat.admin = newAdmin;
    await chat.save();
  } else {
    await new Chat({
      admin: newAdmin,
      chatId,
    }).save();
  }
};

bot.start(async (ctx) => {
  const tgId = ctx.from.id;
  const chatId = ctx.message.chat.id;

  let user = await User.findOne({ tgId });

  if (!user) {
    user = new User({
      tgId,
      tgName: ctx.from.first_name,
    });
    await user.save();
    await changeChatAdmin(chatId, user);
    return ctx.replyWithHTML(
      `Для продолжения перейдите по <a href="${getAuthDialogUrl(
        user.id,
        chatId
      )}">ссылке</a>`
    );
  }

  if (user && user.vkAccessToken) {
    await changeChatAdmin(chatId, user);
    return ctx.reply(
      `Готов принимать фотки и слушаю команды от ${user.tgName}`
    );
  }

  await changeChatAdmin(chatId, user);
  ctx.replyWithHTML(
    `Для продолжения перейдите по <a href="${getAuthDialogUrl(
      user.id,
      chatId
    )}">ссылке</a>`
  );
});

bot.command(`myAlbums`, async (ctx) => {
  const tgId = ctx.from.id;
  const chatId = ctx.message.chat.id;

  const user = await User.findOne({ tgId });
  const chat = await Chat.findOne({ chatId });
  await chat.populate({ path: `admin` }).execPopulate();

  if (!chat.admin.equals(user)) {
    return ctx.reply(
      `В данном чате мной управляет ${user.tgName}. Если Вы хотите перехватить управление, введите команду /start`
    );
  }

  const vk = new VK({
    token: user.vkAccessToken,
  });

  const response = await vk.api.groups.get({
    user_id: user.vkId,
    count: 1000,
  });

  console.log(response);
});

bot.help((ctx) => ctx.reply('Send me a sticker')); //ответ бота на команду /help
bot.on('sticker', (ctx) => ctx.reply('Cool')); //bot.on это обработчик введенного юзером сообщения, в данном случае он отслеживает стикер, можно использовать обработчик текста или голосового сообщения
bot.hears('hi', (ctx) => ctx.reply('Hey there')); // bot.hears это обработчик конкретного текста, данном случае это - "hi"

bot.launch(); // запуск бота
