const neo4jService = require("../services/queriesService/neo4jService");
const mongodbService = require("../services/queriesService/mongodbService");
const elasticSearchService = require("../services/queriesService/elasticSearchService.js");

const WORD_DELIMITER = '_';

async function politicianTimePerChannel(req, res, next) {

	try {
		// TODO: verificar que se envie tokenizado por "-"
		const politicianFullname = req.params.politician.split(WORD_DELIMITER).join(" ");
		const videosId = await neo4jService.getVideosByPolitician(politicianFullname);
		const totalTimePerChannelByVideos = await mongodbService
			.getTotalTimePerChannelByVideos(videosId, req.query.page);
		const channelsNameMap = await mongodbService
			.getChannelsById(totalTimePerChannelByVideos.map(channel => channel._id));

		const totalTimePerChannelByVideosResponse = totalTimePerChannelByVideos.map(channelData => {
			const channelName = channelsNameMap[channelData._id];
			return {
				...channelData,
				channelName
			}
		});

		res.json(totalTimePerChannelByVideosResponse);
	}
	catch (error) {
		console.error("politicianTimePerChannel: " + error);
		next(error);
	}
}

async function politiciansPairsMentions(req, res, next) {
	try {
		const channelNameParsed = req.params.channelName.split(WORD_DELIMITER).join(" ");
		const politiciansPairsMentions = await neo4jService.getPoliticiansPairsMentions(channelNameParsed, req.query.page);
		res.json(politiciansPairsMentions);
	}
	catch (error) {
		console.error("politiciansPairsMentions: " + error);
		next(error);
	}
}

async function channelNames(req, res, next) {
	try {
		const channelNames = await mongodbService.getchannelNames();
		res.json(channelNames);
	}
	catch (error) {
		console.error("channelNames: " + error);
		next(error);
	}
}

async function searchMentions(req, res, next) {
	try {
		const query = req.params.query.split(WORD_DELIMITER).join(" ");
		const mentionsCount = await elasticSearchService.getSearchMentions(query, req.query.from, req.query.page);
		const channelsNameMap = await mongodbService
			.getChannelsById(mentionsCount.map(channel => channel.key));

		const mentionsResponse = mentionsCount.map(channelData => {
			const channelName = channelsNameMap[channelData.key];
			return {
				mentions: channelData.doc_count,
				channelName
			}
		});

		res.json(mentionsResponse);
	} catch (error) {
		console.error("searchMentions: " + error);
		next(error);
	}
}

module.exports = {
	politicianTimePerChannel,
	politiciansPairsMentions,
	channelNames,
	searchMentions
}
