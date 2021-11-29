const neo4j = require("../../databases/neo4j");

async function getVideosByPolitician(politicianFullname) {
    const session = neo4j.getSession();

    return await session.run(
        `MATCH (p:Politician {fullname: "${politicianFullname}"})-[r]->(c:Channel)
        RETURN r.video_id`
    );

}

module.exports = {
    getVideosByPolitician
}