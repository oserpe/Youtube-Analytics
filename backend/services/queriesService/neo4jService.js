const neo4j = require("../../databases/neo4j");

async function getVideosByPolitician(politicianFullname) {
    const session = neo4j.getSession();

	const videosIdsRecords = await session.run(
        `MATCH (p:Politician {fullname: "${politicianFullname}"})-[r]->(c:Channel)
        RETURN r.video_id`
    );
    return videosIdsRecords.records.map(record => record.get(0));
}

module.exports = {
    getVideosByPolitician
}