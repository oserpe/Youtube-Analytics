const neo4jService = require("../services/queriesService/neo4jService");
const mongodbService = require("../services/queriesService/mongodbService");
const e = require("express");



async function politicianTimePerChannel(req, res, next) {

    try {
        // TODO: verificar que se envie tokenizado por "-"
        const politicianFullname = req.params.politician.split("-").join(" ");
        const videosId = await neo4jService.getVideosByPolitician(politicianFullname);
        let totalTimePerChannelByVideos = await mongodbService.getTotalTimePerChannelByVideos(videosId, req.query.page || 1);
        const channels = await mongodbService.getChannelsById(totalTimePerChannelByVideos.map(channel => channel.channel_id));

        totalTimePerChannelByVideos = totalTimePerChannelByVideos.map(channel => {
            const channelName = channels.find(c => c._id == channel.channel_id).name;
            return {
                ...channel,
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