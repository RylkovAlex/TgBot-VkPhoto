const {
  Telegraf,
  Scenes: { Stage },
  session,
} = require('telegraf');

const buttons = require('./keyboards/buttons');

const checkPermissions = require('./middlewares/checkPermissions');
const setState = require('./middlewares/setState');
const checkEnable = require('./middlewares/checkEnable');
const handleBotSetAsChatAdmin = require('./middlewares/handleBotSetAsChatAdmin');
const handleAdminExitFromChat = require('./middlewares/handleAdminExitFromChat');
const checkPhoto = require('./middlewares/checkPhoto');
const checkFullAccess = require('./middlewares/checkFullAccess');
const checkBotIsGroupAdmin = require('./middlewares/checkBotIsGroupAdmin');

const scenes = require('./scenes/scenes');
const setAlbumScene = require('./scenes/setAlbum');
const setLogoScene = require('./scenes/setLogo');
const setFullTokenScene = require('./scenes/setFullToken');

const handleStart = require('./commands/start');
const handleDel = require('./commands/del');
const handleSleep = require('./commands/sleep');
const handleToken = require('./commands/token');
const handleReset = require('./commands/reset');
const getAlbum = require('./commands/getAlbum');
const commands = require('./commands/commands');

const actions = require('./actions/actions');
const handlePhoto = require('./actions/handlePhoto');
const enableBot = require('./actions/enableBot');
const setSimpleToken = require('./actions/setSimpleToken');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(setState);
bot.use(handleBotSetAsChatAdmin);
bot.use(handleAdminExitFromChat);
bot.use(session());

const stage = new Stage([setAlbumScene, setLogoScene, setFullTokenScene]);
stage.hears(buttons.cancel, (ctx) => ctx.scene.leave());
bot.use(stage.middleware());

bot.start(handleStart);

bot.command(commands.setAlbum, checkEnable, checkPermissions, (ctx) => {
  ctx.scene.enter(scenes.setAlbumScene);
});

bot.command(commands.setLogo, checkEnable, checkPermissions, (ctx) => {
  ctx.scene.enter(scenes.setLogoScene);
});

bot.command(commands.sleep, checkPermissions, handleSleep);

bot.command(
  commands.del,
  checkEnable,
  checkPermissions,
  checkFullAccess,
  checkPhoto('inOriginal'),
  handleDel
);

bot.command(commands.skip, checkPermissions, (ctx) =>
  ctx.reply(
    `Команда ${commands.skip} используется иначе.\nПрочтите инструкцию в разделе /help`
  )
);
bot.command(commands.help, checkPermissions, (ctx) =>
  ctx.reply(`https://telegra.ph/TgVkFotoBot--Instrukciya-12-19`)
);
bot.command(commands.reset, checkPermissions, handleReset);
bot.command(commands.getAlbum, checkPermissions, getAlbum);
bot.command(commands.token, checkPermissions, handleToken);

bot.action(actions.setSimpleToken, checkPermissions, setSimpleToken);

bot.action(
  actions.setFullToken,
  checkPermissions,
  checkBotIsGroupAdmin,
  async (ctx) => {
    ctx.scene.enter(scenes.setFullTokenScene);
  }
);

bot.action(
  actions.repeatPhotoUpload,
  checkPermissions,
  checkEnable,
  checkPhoto('inCbQuery'),
  (ctx, next) => {
    const { message_id } = ctx.update.callback_query.message;
    ctx.deleteMessage(message_id);
    return next();
  },
  handlePhoto
);

bot.action(actions.enableBot, checkPermissions, enableBot);

bot.on(`message`, checkPhoto(), checkEnable, handlePhoto);

bot.catch((err, ctx) => {
  console.log(`An error for ${ctx.updateType}`, { err }, { ctx });
});

module.exports = bot;
