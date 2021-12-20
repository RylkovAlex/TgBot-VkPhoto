const { Markup } = require('telegraf');
const auth = require('../utils/auth');
const actions = require('../actions/actions');

module.exports = {
  cancel: `Отмена`,
  enableBot: Markup.button.callback('Включить', 'enableBot'),
  simpleToken: Markup.button.callback(
    'Предоставить частичный доступ',
    'setSimpleToken'
  ),
  fullToken: Markup.button.callback(
    'Предоставить полный доступ',
    'setFullToken'
  ),
  vkFullTokenLink: Markup.button.url(
    'Перейдите по ссылке',
    `${auth.getFullTokenUrl()}`
  ),
  setBotChatAdmin: Markup.button.url(
    'Инструкция',
    `https://telegra.ph/Sdelat-bota-administratorom-chata-11-28`
  ),
  repeat: Markup.button.callback('Повторить', actions.repeatPhotoUpload),
};
