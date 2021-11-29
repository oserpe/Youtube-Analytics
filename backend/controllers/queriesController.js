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

async function politiciansPairsMentions(req, res, next) {
	try {
		const channelNameParsed = req.params.channelName.split("-").join(" ");
		const politiciansPairsMentions = await neo4jService.getPoliticiansPairsMentions(channelNameParsed);
		res.json(politiciansPairsMentions);
	}
	catch (error) {
		console.error("politiciansPairsMentions: " + error);
		next(error);
	}
}


module.exports = {
	politicianTimePerChannel,
	politiciansPairsMentions
}