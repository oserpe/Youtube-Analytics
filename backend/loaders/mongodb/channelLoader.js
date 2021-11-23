const mongoDB = require("../../databases/mongo");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

function load() {

	const db = mongoDB.getDB();

	fs.readFile(path.resolve(__dirname, "../..", "datasets", "channels.json"), "utf-8", (err, data) => {
		if (err) {
			console.error(err);
			return;
		}
		JSON.parse(data).channels.forEach(async channel => {
			const response = await fetch(`${process.env.BASE_PATH}/channels?part=contentDetails&id=${channel._id}&key=${process.env.YOUTUBE_API_KEY}`)
				.then(response => response.json())
				.catch(err => console.log(err));
			channel.uploadPlaylistId = response.items[0].contentDetails.relatedPlaylists.uploads;
			db.collection("channels").updateOne({ _id: channel._id }, { $set: channel }, { upsert: true });
			db.collection("playlistLoadingStatus").updateOne({ _id: channel.uploadPlaylistId }, { $set: { _id: channel.uploadPlaylistId } }, { upsert: true });
		});
	});

	console.log("Channels loaded");
}

module.exports = load;