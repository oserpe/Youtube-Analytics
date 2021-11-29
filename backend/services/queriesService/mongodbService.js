const mongodb = require("../../databases/mongo");

const CHANNEL_PAGE_SIZE = 5;

async function getTotalTimePerChannelByVideos(videosId, page) {

    const db = mongodb.getDB();

    const totalVideoDurationPerChannelId = await db.collection("videos").aggregate([
        {
            $match: { video_id: { $in: videosId } }
        },
        {
            $group: {
                channel_id: channel_id,
                total_time: { $sum: duration }
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
    ]);

    return totalVideoDurationPerChannelId;
};

async function getChannelsById(channelsId) {

    const db = mongodb.getDB();

    const totalVideoDurationPerChannelId = await db.collection("channels").find(
        { channel_id: { $in: channelsId } }
    );

    return totalVideoDurationPerChannelId;
}

module.exports = {
    getTotalTimePerChannelByVideos,
    getChannelsById
}