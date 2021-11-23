const neo4j = require("../../databases/neo4j");
const mongoDB = require("../../databases/mongo");

async function load() {
	const session = neo4j.getSession();

	const db = mongoDB.getDB();
	try {
		await db.collection("politicians").find().toArray().then(async politicians => {
			for (politician of politicians) {
				await session.run(
					'MERGE (p:Politician {fullname: $fullname}) '+
					'ON CREATE SET p.aliases = $aliases, p.party = $party '+
					'ON MATCH SET p.aliases = $aliases, p.party = $party '+
					'RETURN p',
					{ fullname: politician.fullname, aliases: politician.aliases, party: politician.party }
				);
			}
		});
	} finally {
		await neo4j.closeSession(session);
	}

	console.log("Neo4j: Politicians loaded");
}

module.exports = load;