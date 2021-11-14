const express = require(`express`);
const mongoose = require(`mongoose`);
const User = require('./models/user');
const fetch = require('node-fetch');

require(`./db/mongoose`);
require(`./tg-bot/bot`);

const app = express();
const port = process.env.PORT;

const fetchVkAccessToken = async (code) => {
  const url = `https://oauth.vk.com/access_token?client_id=${process.env.VK_APP_ID}&client_secret=${process.env.VK_APP_CLIENT_SECRET}&redirect_uri=${process.env.DOMAIN}/vkauth&code=${code}`;

  const response = await fetch(url);
  const {
    access_token: vkAccessToken,
    user_id: vkId,
    error,
    error_description,
  } = await response.json();

  if (error) {
    throw new Error(error_description);
  }

  if (!vkAccessToken || !vkId) {
    throw new Error(
      `Ошибка авторизации, проверьте интернет соединение и попробуйте ещё раз!`
    );
  }

  return { vkAccessToken, vkId };
};

app.get(`/vkauth`, async (req, res) => {
  try {
    const { code, state, error, error_description } = req.query;
    if (error) {
      throw new Error(error_description);
    }
    const [userId, chatId] = state.split(`:`)

    const { vkAccessToken, vkId } = await fetchVkAccessToken(code);

    const user = await User.findById(userId);
    user.vkAccessToken = vkAccessToken;
    user.vkId = vkId;
    await user.save();

    fetch(encodeURI(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=Ок! Необходимые права доступа получены. В разделе /help Вы найдёте команды для моей настройки`))

    return res.send(
      `Необходимые права доступа получены. Данную страницу можно закрыть и вернуться в чат с ботом.`
    );
  } catch (error) {
    return res
      .status(401)
      .send(`ERROR: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
