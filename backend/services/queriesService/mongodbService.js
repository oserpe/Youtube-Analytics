const mongodb = require("../../databases/mongo");

const CHANNEL_PAGE_SIZE = 5;

async function getTotalTimePerChannelByVideos(videosId, page) {
	page = page || 1;
	if(page < 1) {
		throw new Error("Page must be greater than 0");
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

    const totalVideoDurationPerChannelId = await db.collection("channels").find(
        { _id: { $in: channelsId } }
    ).toArray();
	return totalVideoDurationPerChannelId.reduce(function(map, obj) {
		map[obj._id] = obj.name;
		return map;
	}, {});
}

module.exports = {
    getTotalTimePerChannelByVideos,
    getChannelsById
}