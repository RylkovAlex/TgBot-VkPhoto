const VK = require('vk-io');
const fetch = require('node-fetch');

const getAuthToken = async () => {
  const response = await fetch(`https://oauth.vk.com/authorize?client_id=7997011&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=1376260&response_type=token&v=5.131&state=123456`);
  const data = await response.body;

  console.log(data);
};

getAuthToken()
/* const group_id = 123024522;
const album_id = 281644062;

const vk = new VK({
  token: `8239555fecd2191bd800929014df3fdfcc910741a140006d7006cb1bf5ead763e3f0c83e8ac1361e959b6`,
});

async function run() {
  const response = await vk.api.photos.createAlbum({
		title: `Test album 3`,
    group_id: `123024522`,
    upload_by_admins_only: 0,
	});
  const response = await vk.api.photos.getUploadServer({
    album_id,
    group_id,
  });

  console.log(response);
}

run().catch(console.log); */
