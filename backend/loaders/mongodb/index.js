const mongodbPoliticianLoader = require("./politicianLoader");
const mongodbChannelLoader = require("./channelLoader");
const mongodbVideoLoader = require("./videoLoader");

module.exports = async () => {
	await mongodbPoliticianLoader();
	await mongodbChannelLoader();
	await mongodbVideoLoader();
}