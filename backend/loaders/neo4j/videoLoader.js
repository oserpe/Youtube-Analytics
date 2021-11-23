const neo4j = require("../../databases/neo4j");
const mongoDB = require("../../databases/mongo");

async function load() {
	const session = neo4j.getSession();

	const db = mongoDB.getDB();
	try {
		const politicians = await db.collection("politicians").find().toArray();

		for (politician of politicians) {
			for (alias of politician.aliases) {
				// usamos elasticsearch para encontrar todos los videos relacionados a un politico
				let videos;
				for (video of videos) {
					await session.run(`MATCH (p:Politician {id: ${politician.fullname}}), (c:Channel {channelId: ${video.channel}})
									CREATE (p)-[:mentioned_by]->(v)`);
				}
			}
		}
	} finally {
		await neo4j.closeSession(session);
	}

	console.log("Neo4j: Channels loaded");
}

module.exports = load;