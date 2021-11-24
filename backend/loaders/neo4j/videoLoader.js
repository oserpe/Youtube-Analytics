const neo4j = require("../../databases/neo4j");
const mongoDB = require("../../databases/mongo");
const elasticDB = require("../../databases/elasticsearch");

async function load() {
	const session = neo4j.getSession();

	const db = mongoDB.getDB();
	const elasticClient = elasticDB.getDB();
	try {
		const politicians = await db.collection("politicians").find().toArray();

		for (const politician of politicians) {
			// usamos elasticsearch para encontrar todos los videos relacionados a un politico
			const aliasQueryString = [...politician.aliases, politician.fullname]
				.map((alias) => `(${alias})`)
				.join(" OR ");

			console.log(aliasQueryString);
			const { body } = await elasticClient.search({
				index: "videos",
				body: {
					query: {
						query_string: {
							fields: ["title", "description"],
							query: aliasQueryString,
							default_operator: "AND",
						},
					},
				},
			});

			for (const video of body.hits.hits) {
				await session.run(`MATCH (p:Politician {fullname: "${politician.fullname}"}), (c:Channel {channel_id: "${video._source.channel_id}"})
									MERGE (p)-[:mentioned_by {video_id: "${video._source.video_id}"}]->(c)`);
			}
		}
	} finally {
		await neo4j.closeSession(session);
	}

	console.log("Neo4j: Relationships loaded");
}

module.exports = load;
