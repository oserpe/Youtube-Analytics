const neo4j = require("../../databases/neo4j");
const mongoDB = require("../../databases/mongo");
const elasticDB = require("../../databases/elasticsearch");
const ELASTIC_SEARCH_SIZE = 10000;

async function load() {
	const session = neo4j.getSession();

	const mongoClient = mongoDB.getDB();
	const elasticClient = elasticDB.getDB();

	try {
		let count = 0;
		const politicians = await mongoClient
			.collection("politicians")
			.find()
			.toArray();

		for (const politician of politicians) {
			// usamos elasticsearch para encontrar todos los videos relacionados a un politico
			const aliasQueryString = [...politician.aliases, politician.fullname]
				.map((alias) => `(${alias})`)
				.join(" OR ");

			let page = 0;
			let body;
			do {
				const response = await elasticClient.search({
					index: "videos",
					body: {
						from: page * ELASTIC_SEARCH_SIZE,
						size: ELASTIC_SEARCH_SIZE,
						query: {
							query_string: {
								fields: ["title", "description"],
								query: aliasQueryString,
								default_operator: "AND",
							},
						},
					},
				});
				body = response.body;
			} while (++page * ELASTIC_SEARCH_SIZE < body.hits.total);

			for (const video of body.hits.hits) {
				await session.run(`MATCH (p:Politician {fullname: "${politician.fullname}"}), (c:Channel {channel_id: "${video._source.channel_id}"})
									MERGE (p)-[:mentioned_by {video_id: "${video._source.video_id}"}]->(c)`);
			}

			console.log(
				++count + " of " + politicians.length + " politicians loaded"
			);
		}
	} finally {
		await neo4j.closeSession(session);
	}

	console.log("Neo4j: Relationships loaded");
}

module.exports = load;
