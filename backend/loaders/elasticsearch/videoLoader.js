const mongoDB = require("../../databases/mongo");
const elasticDB = require("../../databases/elasticsearch");

async function load() {
	const mongoClient = mongoDB.getDB();
	const elasticClient = elasticDB.getDB();
	try {
		await elasticClient.indices.create({
			index: "videos",
			body: {
				settings: {
					analysis: {
						analyzer: {
							my_analyzer: {
								tokenizer: "letter",
							},
						},
					},
				},
				mappings: {
					video: {
						properties: {
							video_id: { type: "text" },
							title: {
								analyzer: "my_analyzer",
								type: "text",
							},
							description: {
								analyzer: "my_analyzer",
								type: "text",
							},
							channel_id: { type: "text" },
							published_at: {
								type: "date",
								format: "YYYY-MM-DD'T'HH:mm:ssZ",
							},
						},
					},
				},
			},
		});
	} catch (err) {
		console.error(err);
	}

	const videos = await mongoClient
		.collection("videos")
		.find()
		.toArray()
		.then(async (videos) => {
			for (const video of videos) {
				try {
					await elasticClient.index({
						index: "videos",
						body: {
							video_id: video._id,
							title: video.title,
							description: video.description,
							channel_id: video.channel_id,
							published_at: video.published_at,
						},
					});
				} catch (err) {
					console.error(err);
				}
			}
		});

	// We need to force an index refresh at this point, otherwise we will not
	// get any result in the consequent search
	await elasticClient.indices.refresh({ index: "videos" });

	console.log("ElasticSearch: Finished creating index");

	// Let's search!
	//   const { body } = await elasticClient.search({
	//     index: "videos",
	//     body: {
	//       query: {
	//         match: { title: "CFK" },
	//       },
	//     },
	//   });

	//   console.log(body.hits.hits);
}

module.exports = load;
