const actions = require('../actions/actions');
const inlineKeyboards = require('../keyboards/inlineKeyboards');

const checkPermissions = async (ctx, next) => {
  const { user, chat, cbData } = ctx.state;

  await chat.populate({ path: `admin` }).execPopulate();

  if (chat.admin.equals(user)) {
    if (cbData === actions.setFullToken || cbData === actions.setSimpleToken) {
      ctx.answerCbQuery(`${cbData}`);
      return next();
    }
    if (!user.vkAccess.token) {
      return ctx.replyWithHTML(
        `Для начала мне нужны права доступа в VK`,
        inlineKeyboards.chouseToken
      );
    }
    return next();
  }

  if (cbData) {
    ctx.answerCbQuery(`Нет доступа для совершения данной операции`);
  }

  return ctx.replyWithHTML(
    `В данном чате мной управляет ${chat.admin.tgName}.\nЕсли Вы хотите перехватить управление, введите команду /start \n<b>Внимание:</b> данное действие приведёт к сбросу большинства настроек`
  );
};

module.exports = checkPermissions;
