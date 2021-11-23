const neo4jPoliticianLoader = require("./politicianLoader");
const neo4jChannelLoader = require("./channelLoader");
// const neo4jVideoLoader = require("./videoLoader");

module.exports = async () => {
	await neo4jPoliticianLoader();
	neo4jChannelLoader();
	// neo4jVideoLoader();
}