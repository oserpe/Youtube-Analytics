const neo4jService = require("../services/queriesService/neo4jService");
const mongodbService = require("../services/queriesService/mongodbService");
const elasticSearchService = require("../services/queriesService/elasticSearchService.js");

const WORD_DELIMITER = '_';

// TODO: MODULARIZAR LAS DOS SIGUIENTES FUNCIONES EN UNA SOLA?
async function politicianTimePerChannel(req, res, next) {
	try {
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

async function politiciansLikenessPerChannel(req, res, next) {
	try {
		const politicianFullname = req.params.politician.split(WORD_DELIMITER).join(" ");
		const videosId = await neo4jService.getVideosByPolitician(politicianFullname);
		const politiciansLikenessPerChannel = await mongodbService
			.getPoliticiansLikenessPerChannel(videosId, req.query.page);
		const channelsNameMap = await mongodbService
			.getChannelsById(politiciansLikenessPerChannel.map(channel => channel._id));

		const politiciansLikenessPerChannelResponse = politiciansLikenessPerChannel.map(channelData => {
			const channelName = channelsNameMap[channelData._id];
			return {
				...channelData,
				channelName
			}
		});
		res.json(politiciansLikenessPerChannelResponse);
	}
	catch (error) {
		console.error("politiciansLikenessPerChannel: " + error);
		next(error);
	}
}

async function politicianPairsMentions(req, res, next) {
	try {
		const channelNameParsed = req.params.channelName.split(WORD_DELIMITER).join(" ");
		const politicianPairsMentions = await neo4jService.getPoliticianPairsMentions(channelNameParsed, req.query.page);
		res.json(politicianPairsMentions);
	}
	catch (error) {
		console.error("politicianPairsMentions: " + error);
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
	politiciansPairsMentions: politicianPairsMentions,
	channelNames,
	searchMentions,
	politiciansLikenessPerChannel
}
