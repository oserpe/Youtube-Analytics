const neo4j = require("../../databases/neo4j");
const mongoDB = require("../../databases/mongo");

async function load() {
	const session = neo4j.getSession();

	const db = mongoDB.getDB();
	try {
		await db.collection("channels").find().toArray().then(async channels => {
			for (channel of channels) {
				await session.run(
					`MERGE (c:Channel {channelId: ${channel._id}}) 
					ON CREATE SET c.name = ${channel.name} 
					ON MATCH SET c.name = ${channel.name}  
					RETURN c`,
				);
			}
		});
	} finally {
		await neo4j.closeSession(session);
	}

	console.log("Neo4j: Channels loaded");
}

module.exports = load;