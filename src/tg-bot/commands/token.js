const inlineKeyboards = require('../keyboards/inlineKeyboards');

module.exports = (ctx) =>
  ctx.reply(
    `Если Вы хотите обновить токены доступа, выберите нужный вариант:`,
    inlineKeyboards.chouseToken
  );
