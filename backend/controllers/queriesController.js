const neo4jService = require("../services/neo4jService");
const mongodbService = require("../services/mongodbService");
const elasticSearchService = require("../services/elasticSearchService.js");
const paginationService = require("../services/paginationService.js");

// TODO: MODULARIZAR LAS DOS SIGUIENTES FUNCIONES EN UNA SOLA?
async function politicianTimePerChannel(req, res, next) {
	try {
		const politicianFullname = req.params.politician;
		const videosId = await neo4jService.getVideosByPolitician(politicianFullname);
		const totalTimePerChannelByVideos = await mongodbService
			.getTotalTimePerChannelByVideos(videosId);
		const channelsNameMap = await mongodbService
			.getChannelsById(totalTimePerChannelByVideos.map(channel => channel._id));

		const totalTimePerChannelByVideosResponse = totalTimePerChannelByVideos.map(channelData => {
			const channelName = channelsNameMap[channelData._id];
			return {
				...channelData,
				channel_name: channelName
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
			.getPoliticiansLikenessPerChannel(videosId);
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
		const maxPage = await neo4jService.getPoliticiansPairsMentionsMaxPage(channelName);
		paginationService.getPaginatedResponse(res, req.query.page, maxPage, '/politician-pairs-mentions/' + encodeURIComponent(channelName));
		res.json(politicianPairsMentions);
	}
	catch (error) {
		console.error("politiciansPairsMentions: " + error);
		next(error);
	}
}

async function channelNames(req, res, next) {
	try {
		const channelNames = await mongodbService.getChannelNames();
		res.json(channelNames);
	}
	catch (error) {
		console.error("channelNames: " + error);
		next(error);
	}
}

async function politicians(req, res, next) {
	try {
		const politicians = await mongodbService.getPoliticians();
		res.json(politicians);
	}
	catch (error) {
		console.error("politicians: " + error);
		next(error);
	}
}

async function searchMentions(req, res, next) {
	try {
		const mentionsCount = await elasticSearchService.getSearchMentions(req.params.query, req.query.from);
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

async function mentionsEvolution(req, res, next) {
	try {
		const channelsName = req?.query?.channels;
		const channelsMap = await mongodbService.getChannelsIdsByName(channelsName);
		const mentionsEvolution =
			await elasticSearchService.getMentionsEvolution(req.params.query, Object.values(channelsMap));
		res.json(mentionsEvolution);
	} catch (error) {
		console.error("mentionsEvolution: " + error);
		next(error);
	}
}

module.exports = {
	politicianTimePerChannel,
	politiciansPairsMentions,
	channelNames,
	politicians,
	searchMentions,
	politiciansLikenessPerChannel,
	mentionsEvolution
}
