const express = require(`express`);
const fetch = require('node-fetch');
const User = require('./models/user');
const bot = require('./tg-bot/bot');

require(`./db/mongoose`);

const app = express();
const port = process.env.PORT;

const secretPath = `/telegraf/${bot.secretPathComponent()}`;

if (process.env.DEV_MODE) {
  bot.launch();
} else {
  bot.telegram.setWebhook(`${process.env.DOMAIN}${secretPath}`);
}

app.use(bot.webhookCallback(secretPath));

const fetchVkAccessToken = async (code) => {
  const url = `https://oauth.vk.com/access_token?client_id=${process.env.VK_APP_ID}&client_secret=${process.env.VK_APP_CLIENT_SECRET}&redirect_uri=${process.env.DOMAIN}/vkauth&code=${code}`;

  const response = await fetch(url);
  const {
    access_token,
    user_id: vkId,
    error,
    error_description,
  } = await response.json();

  if (error) {
    throw new Error(error_description);
  }

  if (!access_token || !vkId) {
    throw new Error(
      `Ошибка авторизации, проверьте интернет соединение и попробуйте ещё раз!`
    );
  }

  return { access_token, vkId };
};

app.get(`/vkauth`, async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    if (error) {
      throw new Error(error_description);
    }
    const [userId, chatId] = state.split(`:`);

    const { access_token, vkId } = await fetchVkAccessToken(code);

    const user = await User.findById(userId);
    user.vkAccess = {
      token: access_token,
      isFull: false,
    };
    user.vkId = vkId;
    await user.save();

    fetch(
      encodeURI(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=Необходимые права доступа получены. В разделе /help Вы найдёте команды для моей настройки`
      )
    );

    return res.send(
      `Необходимые права доступа получены.\nДанную страницу можно закрыть и вернуться в чат с ботом.`
    );
  } catch (error) {
    return res.status(401).send(`ERROR: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
