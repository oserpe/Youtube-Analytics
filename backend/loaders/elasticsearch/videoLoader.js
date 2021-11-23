const mongoDB = require("../../databases/mongo");
const elasticDB = require("../../databases/elasticsearch");

async function load() {
	const mongoClient = mongoDB.getDB();
	const elasticClient = elasticDB.getDB();
	try {
		await elasticClient.indices.putMapping({
			index: 'videos',
			body: {
				properties: {
					video_id: { "type": "string" },
					title: { "type": "string" },
					description: { "type": "string" },
					channel_id: { "type": "string" },
					published_at: {
						"type": "date",
						"format": "EEE MMM dd HH:mm:ss Z yyyy"
					},
				}
			}

		});
	}
	catch (err) {
		console.error(err);
	}

	console.log("After index creation")

	// const videos = await mongoClient.collection("videos").find().toArray();

	// for (video of videos) {
	// 	console.log(video);
	// 	await elasticClient.index({
	// 		index: "videos",

	// 		body: {
	// 			"properties": {
	// 				"video_id": video._id,
	// 				"title": video.title,
	// 				"description": video.description,
	// 				"channel_id": video.channel_id,
	// 			}
	// 		}
	// 	});
	// }
	// // We need to force an index refresh at this point, otherwise we will not
	// // get any result in the consequent search
	// await elasticClient.indices.refresh({ index: 'videos' })

	// // Let's search!
	// const { body } = await client.search({
	// 	index: 'videos',
	// 	body: {
	// 		query: {
	// 			match: { title: 'CFK' }
	// 		}
	// 	}
	// })

	// console.log(body.hits.hits)
}

module.exports = load;