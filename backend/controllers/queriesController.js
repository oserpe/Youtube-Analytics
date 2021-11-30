const neo4jService = require("../services/neo4jService");
const mongodbService = require("../services/mongodbService");
const elasticSearchService = require("../services/elasticSearchService.js");

// TODO: MODULARIZAR LAS DOS SIGUIENTES FUNCIONES EN UNA SOLA?
async function politicianTimePerChannel(req, res, next) {
	try {
		const politicianFullname = req.params.politician;
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
		const politicianFullname = req.params.politician;
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

async function politiciansPairsMentions(req, res, next) {
	try {
		const channelName = req.params.channelName;
		const politicianPairsMentions = await neo4jService.getPoliticiansPairsMentions(channelName, req.query.page);
		res.json(politicianPairsMentions);
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
		const query = req.params.query;
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
	searchMentions,
	politiciansLikenessPerChannel
}
