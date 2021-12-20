const { Markup } = require('telegraf');
const buttons = require('./buttons');

const keyboards = {
  exit_keyboard: Markup.keyboard([buttons.cancel]).oneTime().resize(),
  remove_keyboard: Markup.removeKeyboard(),
};

module.exports = keyboards;
