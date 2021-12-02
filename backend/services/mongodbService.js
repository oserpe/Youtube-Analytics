const mongodb = require("../databases/mongo");

async function getTotalTimePerChannelByVideos(videosId) {
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
	const queryChannelsName = channelsName ? { name: { $in: channelsName } } : {};
	const channels = await db.collection("channels").find(queryChannelsName).toArray();

	return channels.reduce(function (map, obj) {
		map[obj.name] = obj._id;
		return map;
	}, {});
}

async function getChannelNames() {
	const db = mongodb.getDB();

	return await db.collection("channels").find({}, { projection: { _id: 0, channel_name: '$name' } }).toArray();
}

async function getPoliticians(){
	const db = mongodb.getDB();

	return await db.collection("politicians").find({}, { projection: { _id: 0, politician_name: '$fullname' } }).toArray();
}

async function getPoliticiansLikenessPerChannel(videosId) {
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
		}
	]).toArray();
	return politiciansLikenessPerChannel;
}

module.exports = {
	getTotalTimePerChannelByVideos,
	getChannelsById,
	getChannelsIdsByName,
	getChannelNames,
	getPoliticians,
	getPoliticiansLikenessPerChannel
}