const neo4j = require("../databases/neo4j");

const CHANNEL_PAGE_SIZE = 8;

async function getVideosByPolitician(politicianFullname) {
	const session = neo4j.getSession();

	const videosIdsRecords = await session.run(
		`MATCH (p:Politician {fullname: "${politicianFullname}"})-[r]->(c:Channel)
        RETURN r.video_id`
	);
	return videosIdsRecords.records.map(record => record.get(0));
}

function getPoliticianPairsMentionsQuery(channelName) {
	return `MATCH (p1:Politician)-[r1:mentioned_by]->(c:Channel {name: "${channelName}"})<-[r2:mentioned_by {video_id: r1.video_id}]-(p2:Politician)
			WHERE p1.fullname < p2.fullname `;
	// Forma vieja
	// `MATCH (p1:Politician)-[r1:mentioned_by]->(c:Channel {name: "${channelName}"})<-[r2:mentioned_by]-(p2:Politician)
	// WHERE r1.video_id = r2.video_id AND p1.fullname < p2.fullname
	// ver si hay forma de hacerlo sin WHERE

	// Forma sin where NO FUNCIONA
	// `MATCH (p1:Politician)-[r:mentioned_by]->(c:Channel {name: "${channelName}"})<-[r:mentioned_by]-(p2:Politician)
}

async function getPoliticiansPairsMentionsMaxPage(channelName) {
	const session = neo4j.getSession();

	const result = await session.run(
		getPoliticianPairsMentionsQuery(channelName) +
		` RETURN COUNT(r1) AS totalMentions`
	);
	return Math.ceil(result.records[0].get(0).toNumber() / CHANNEL_PAGE_SIZE);
}

async function getPoliticiansPairsMentions(channelName, page) {
	const session = neo4j.getSession();

	page = page || 1;
	if (page < 1) {
		throw new Error("Neo4j Service: Page must be greater than 0");
	}

	const skip = CHANNEL_PAGE_SIZE * (page - 1);
	const limit = CHANNEL_PAGE_SIZE;

	const pairs = await session.run(
		getPoliticianPairsMentionsQuery(channelName) +
		` RETURN p1.fullname, p2.fullname, count(r1) AS mentions, collect(r1.video_id) AS video_ids
		ORDER BY mentions DESC, p1.fullname, p2.fullname
		SKIP ${skip} LIMIT ${limit}`
	);
	return pairs.records.map(record => {
		return {
			firstPolitician: record.get(0),
			secondPolitician: record.get(1),
			mentions: record.get(2).toNumber()
		}
	});
}

module.exports = {
	getVideosByPolitician,
	getPoliticiansPairsMentions,
	getPoliticiansPairsMentionsMaxPage
}