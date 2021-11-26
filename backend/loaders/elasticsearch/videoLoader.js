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
								tokenizer: "standard",
								filter: ["lowercase", "asciifolding", "default_spanish_stopwords", "default_spanish_stemmer"],
							},
						},
						filter: {
							default_spanish_stopwords: {
								type: "stop",
								stopwords: ["_spanish_"],
							},
							default_spanish_stemmer: {
								type: "stemmer",
								name: "spanish",
							}
						}
					},
				},
				mappings: {
					video: {
						properties: {
							video_id: { type: "text" },
							title: {
								type: "text",
								analyzer: "my_analyzer",
							},
							description: {
								type: "text",
								analyzer: "my_analyzer",
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

	let count = 0;
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

				if (count % Math.floor(videos.length / 100) === 0) {
					console.log(Math.floor(count / videos.length * 100) + '% loaded');
				}
				count++;
			}
		});

	// We need to force an index refresh at this point, otherwise we will not
	// get any result in the consequent search
	await elasticClient.indices.refresh({ index: "videos" });

	console.log("ElasticSearch: Finished creating video index");

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
