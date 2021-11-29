const neo4jService = require("../services/queriesService/neo4jService");
const mongodbService = require("../services/queriesService/mongodbService");
const e = require("express");



async function politicianTimePerChannel(req, res, next) {

	try {
		// TODO: verificar que se envie tokenizado por "-"
		const politicianFullname = req.params.politician.split("-").join(" ");
		const videosId = await neo4jService.getVideosByPolitician(politicianFullname);
		let totalTimePerChannelByVideos = await mongodbService
			.getTotalTimePerChannelByVideos(videosId, req.query.page);
		const channelsNameMap = await mongodbService
			.getChannelsById(totalTimePerChannelByVideos.map(channel => channel._id));

		totalTimePerChannelByVideos = totalTimePerChannelByVideos.map(channelData => {
			const channelName = channelsNameMap[channelData._id];
			return {
				...channelData,
				channelName
			}
		});

		res.json(totalTimePerChannelByVideos);
	}
	catch (error) {
		console.error("politicianTimePerChannel: " + error);
		next(error);
	}
}


module.exports = {
	politicianTimePerChannel,
}