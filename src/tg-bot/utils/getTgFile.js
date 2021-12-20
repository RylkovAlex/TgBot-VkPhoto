const fetch = require('node-fetch');

module.exports = {
  async url(file_id) {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${file_id}`
      );
      const json = await response.json();
      const { file_path } = json.result;

      return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file_path}`;
    } catch (error) {
      throw new Error(`Error in getTgFile.url(${file_id}): ${error.message}`);
    }
  },
  async buffer(file_id) {
    try {
      const fileUrl = await this.url(file_id);
      const fileBuffer = await fetch(fileUrl).then((res) => {
        if (res.status !== 200) {
          throw new Error(
            `Get photo from Telegram by ${fileUrl}:\nStatus was not 200`
          );
        }
        return res.buffer();
      });
      return fileBuffer;
    } catch (error) {
      throw new Error(
        `Error in getTgFile.buffer(${file_id}): ${error.message}`
      );
    }
  },
};
