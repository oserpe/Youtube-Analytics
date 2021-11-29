const neo4j = require("../../databases/neo4j");

async function getVideosByPolitician(politicianFullname) {
    const session = neo4j.getSession();

	const videosIdsRecords = await session.run(
        `MATCH (p:Politician {fullname: "${politicianFullname}"})-[r]->(c:Channel)
        RETURN r.video_id`
    );
    return videosIdsRecords.records.map(record => record.get(0));
}

async function getPoliticiansPairsMentions(channelName){
    const session = neo4j.getSession();
	const skip=0;
	const limit=5;

	const pairs = await session.run(
		`MATCH (p1:Politician)-[r1:mentioned_by]->(c:Channel {name: "${channelName}"})<-[r2:mentioned_by]-(p2:Politician)
		WHERE r1.video_id = r2.video_id AND p1.fullname < p2.fullname
		RETURN p1.fullname, p2.fullname, count(r1) AS mentions, collect(r1.video_id) AS video_ids
		ORDER BY mentions, p1.fullname, p2.fullname
		SKIP ${skip} LIMIT ${limit}`
		// ver si hay forma de hacerlo sin WHERE
        // `MATCH (p1:Politician)-[r:mentioned_by]->(c:Channel {name: "${channelName}"})<-[r:mentioned_by]-(p2:Politician)
		// RETURN p1.fullName, p2.fullname, count(r)`
    );
    return pairs.records
	.map(record => {return {
		firstPolitician: record.get(0),
		secondPolitician: record.get(1),
		mentions: record.get(2).toNumber()
	}});
}

module.exports = {
    getVideosByPolitician,
	getPoliticiansPairsMentions
}