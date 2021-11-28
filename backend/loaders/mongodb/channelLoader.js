const mongoDB = require("../../databases/mongo");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const fsPromises = fs.promises;

async function load() {

	const db = mongoDB.getDB();

	await fsPromises.readFile(path.resolve(__dirname, "../..", "datasets", "channels.json"))
		.then(async data => {
			data = data.toString();
			const channels = JSON.parse(data).channels;
			for (const channel of channels) {
				const response = await fetch(`${process.env.BASE_PATH}/channels?part=contentDetails&id=${channel._id}&key=${process.env.YOUTUBE_API_KEY}`)
					.then(response => response.json())
					.catch(err => console.log(err));
				channel.upload_playlist_id = response.items[0].contentDetails.relatedPlaylists.uploads;
				await db.collection("channels").updateOne({ _id: channel._id }, { $set: channel }, { upsert: true });
				await db.collection("playlistLoadingStatus").updateOne({ _id: channel.upload_playlist_id }, { $set: { _id: channel.upload_playlist_id } }, { upsert: true });
			};
		})
		.catch(error => console.error("MongoDB: Loading channels\n" + error));

	console.log("MongoDB: Channels loaded");
}

module.exports = load;