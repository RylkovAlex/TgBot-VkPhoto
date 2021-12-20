const { Markup } = require('telegraf');
const buttons = require('./buttons');

const inlineKeyboards = {
  enableBot: Markup.inlineKeyboard([buttons.enableBot]),
  chouseToken: Markup.inlineKeyboard([
    [buttons.simpleToken],
    [buttons.fullToken],
  ]),
  fullToken: Markup.inlineKeyboard([buttons.fullToken]),
  vkFullTokenLink: Markup.inlineKeyboard([buttons.vkFullTokenLink]),
  setBotChatAdmin: Markup.inlineKeyboard([buttons.setBotChatAdmin]),
  repeat: Markup.inlineKeyboard([buttons.repeat]),
};

module.exports = inlineKeyboards;
