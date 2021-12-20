const auth = {
  getDialogUrl: (userId, chatId) =>
    `https://oauth.vk.com/authorize?client_id=${process.env.VK_APP_ID}&display=popup&redirect_uri=${process.env.DOMAIN}/vkauth&scope=${process.env.VK_APP_SCOPE}&response_type=code&state=${userId}:${chatId}&v=5.131&revoke=1`,

  getFullTokenUrl: () =>
    `https://oauth.vk.com/authorize?client_id=${process.env.VK_APP_ID}&scope=${process.env.VK_APP_SCOPE}&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1`,
};

module.exports = auth;
