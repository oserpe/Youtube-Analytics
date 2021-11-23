const fetch = require("node-fetch");
const mongoDB = require("../../databases/mongo");

let youtubeApiKeyIndex = 0;

const YOUTUBE_API_KEYS = [
	"AIzaSyC54bLIQkg2utR6vknEVZ8Nyz3KZlfKYis",
	"AIzaSyADq14yoBnCpe2CM7Q2dOoedrqbDHOWGmQ",
	"AIzaSyCyMhH7cWLxHNAdc2mBDsVVZnWjJ9gKb34",
	"AIzaSyC9dyH41I2JGEyNnjgYoDQYLXbwtIgRYxw",
	"AIzaSyCgHC1QFeoQQzVnMqv2qK6wiebFK8BpSdc",
	"AIzaSyBq4cdAgqXGGpAgfDV0lCeKR6CNVIZGa34",
	"AIzaSyBCtsoAmgKWw7HYdM2ukaCqS1wKe-Plliw",
	"AIzaSyAmD5IsXdEkXCR17-UoG60dCLk-WOWDLm8"
];

const MAX_REQUESTS_PER_PLAYLIST = 3;

const MAX_FETCH_ATTEMPTS = 3;

function fetchWithTimeout(url, timeout = 500) {
	return Promise.race([
		fetch(url),
		new Promise(() =>
			setTimeout(() => new Error('timeout'), timeout)
		)
	]);
}


async function fetchWithTries(url, timeout = 500) {
	let found = false;
	let tries = 0;
	let response;
	while (!found && tries < MAX_FETCH_ATTEMPTS) {
		response = await fetchWithTimeout(url, timeout)
			.then(res => { found = true; return res; })
			.catch(err => { tries++; });
	}

	if (!found)
		throw new Error("Timeout with url " + url);

	return response;
}

function parseIso8601ToMillis(duration) {
	var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
	var hours = 0, minutes = 0, seconds = 0, totalMillis = 0;

	if (reptms.test(duration)) {
		var matches = reptms.exec(duration);
		if (matches[1]) hours = Number(matches[1]);
		if (matches[2]) minutes = Number(matches[2]);
		if (matches[3]) seconds = Number(matches[3]);
		totalMillis = (hours * 3600 + minutes * 60 + seconds) * 1000;
	}
	return totalMillis;
}

async function retryFetch(url) {
	let isRequestSuccessful = false;
	let response;

	while (!isRequestSuccessful && youtubeApiKeyIndex < YOUTUBE_API_KEYS.length) {
		response = await fetchWithTries(`${url}&key=${YOUTUBE_API_KEYS[youtubeApiKeyIndex]}`);

		if (response.status != 200 && response.status != 403) {
			throw `Error: HTTP code ${response.status} with URL ${url} and API key ${YOUTUBE_API_KEYS[youtubeApiKeyIndex]}`
		}

		isRequestSuccessful = response.status == 200;

		if (!isRequestSuccessful)
			youtubeApiKeyIndex++;

	}

	if (youtubeApiKeyIndex == YOUTUBE_API_KEYS.length) {
		throw "Out of api keys";
	}

	return response.json();
}

async function uploadVideosToDB(items) {
	const db = mongoDB.getDB();

	let response;
	for (item of items) {
		try {
			response = await retryFetch(`${process.env.BASE_PATH}/videos?part=statistics&id=${item.snippet.resourceId.videoId}`);
			const statisticsResponse = response.items[0].statistics;

			const statistics = {
				likes: statisticsResponse.likeCount,
				dislikes: statisticsResponse.dislikeCount,
				views: statisticsResponse.viewCount,
				commentCount: statisticsResponse.commentCount
			};

			response = await retryFetch(`${process.env.BASE_PATH}/videos?part=contentDetails&id=${item.snippet.resourceId.videoId}`);
			duration = response.items[0].contentDetails.duration;

			const video = {
				_id: item.snippet.resourceId.videoId,
				channel_id: item.snippet.videoOwnerChannelId,
				title: item.snippet.title,
				description: item.snippet.description,
				published_at: item.snippet.publishedAt,
				duration: parseIso8601ToMillis(duration),
				statistics
			}

			db.collection("videos").updateOne({ _id: video._id }, { $set: video }, { upsert: true });
		} catch (err) {
			console.error({
				description: "Uploading video " + item.snippet.resourceId.videoId,
				errorMessage: err
			});
			throw err;
		}
	}
}

async function load() {
	const db = mongoDB.getDB();

	let loadingStatusArray;
	do {
		loadingStatusArray = await db.collection("playlistLoadingStatus").find().toArray();
		for (loadingStatus of loadingStatusArray) {
			console.log("Fetching playlist id: " + loadingStatus._id);
			for (let i = 0; i < MAX_REQUESTS_PER_PLAYLIST; i++) {
				try {
					console.log("\tFetching page " + loadingStatus.nextPageToken);
					const response = await retryFetch(`${process.env.BASE_PATH}/playlistItems?part=snippet&playlistId=${loadingStatus._id}&maxResults=50&pageToken=${loadingStatus.nextPageToken || ""}`);
					await uploadVideosToDB(response.items);
					loadingStatus.nextPageToken = response.nextPageToken;
					if (!response.nextPageToken) {
						break;
					}
				} catch (err) {
					if (err.message === "Out of api keys") {
						throw err;
					}
					console.error({
						description: "Loading videos",
						errorMessage: err
					});
				}
			}
			if (loadingStatus.nextPageToken) {
				db.collection("playlistLoadingStatus").updateOne({ _id: loadingStatus._id }, { $set: loadingStatus }, { upsert: true });
			}
			else {
				console.log("Deleting playlist id: " + loadingStatus._id);
				db.collection("playlistLoadingStatus").deleteOne({ _id: loadingStatus._id });
			}
			console.log("Finished loading playlistId: " + loadingStatus._id);
		}
	} while (loadingStatusArray.length > 0);

	console.log("MongoDB: Videos loaded");
}

module.exports = load;