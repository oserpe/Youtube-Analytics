const mongodb = require("../databases/mongo");

const CHANNEL_PAGE_SIZE = 5;

async function getTotalTimePerChannelByVideos(videosId, page) {
	page = page || 1;
	if (page < 1) {
		throw new Error("Mongo Service: Page must be greater than 0");
	}

	const db = mongodb.getDB();

	const totalVideoDurationPerChannelId = await db.collection("videos").aggregate([
		{
			$match: { '_id': { $in: videosId } }
		},
		{
			$group: {
				_id: '$channel_id',
				total_time: { $sum: '$duration' }
			}
		},
		{
			$sort: { total_time: -1 }
		},
		{
			$skip: CHANNEL_PAGE_SIZE * (page - 1)
		},
		{
			$limit: CHANNEL_PAGE_SIZE
		}
	]).toArray();

	return totalVideoDurationPerChannelId;
};

async function getChannelsById(channelsId) {
	const db = mongodb.getDB();

	const channels = await db.collection("channels").find(
		{ _id: { $in: channelsId } }
	).toArray();

	return channels.reduce(function (map, obj) {
		map[obj._id] = obj.name;
		return map;
	}, {});
}

async function getChannelsIdsByName(channelsName) {
	const db = mongodb.getDB();
	console.log("CHANNELS NAME=====", channelsName)
	const queryChannelsName = channelsName ? { name: { $in: channelsName } } : {};
	const channels = await db.collection("channels").find(queryChannelsName).toArray();

	return channels.reduce(function (map, obj) {
		map[obj.name] = obj._id;
		return map;
	}, {});
}

async function getChannelNames() {
	const db = mongodb.getDB();

	return await db.collection("channels").find({}, { projection: { _id: 0, name: 1 } }).toArray();
}

async function getPoliticiansLikenessPerChannel(videosId, page) {
	page = page || 1;
	if (page < 1) {
		throw new Error("Mongo Service: Page must be greater than 0");
	}

	const db = mongodb.getDB();

	const politiciansLikenessPerChannel = await db.collection("videos").aggregate([
		{
			$match: { '_id': { $in: videosId } }
		},
		{
			$group: {
				_id: '$channel_id',
				likes: { $sum: '$statistics.likes' },
				dislikes: { $sum: '$statistics.dislikes' },
			}
		},
		{
			$sort: { _id: -1 }
		},
		{
			$skip: CHANNEL_PAGE_SIZE * (page - 1)
		},
		{
			$limit: CHANNEL_PAGE_SIZE
		}
	]).toArray();
	return politiciansLikenessPerChannel;
}

module.exports = {
	getTotalTimePerChannelByVideos,
	getChannelsById,
	getChannelsIdsByName,
	getChannelNames,
	getPoliticiansLikenessPerChannel
}