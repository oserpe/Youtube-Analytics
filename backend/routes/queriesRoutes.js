const queriesController = require("../controllers/queriesController");
const decodeUriParameter = require("../middlewares/decodeUriParameter");


module.exports = app => {
    app.get("/politician-time-per-channel/:politician", decodeUriParameter.politician, queriesController.politicianTimePerChannel);
    app.get("/politician-pairs-mentions/:channelName", decodeUriParameter.channelName, queriesController.politiciansPairsMentions);
    app.get("/channel-names", queriesController.channelNames);
    app.get("/mentions/:query", decodeUriParameter.query, queriesController.searchMentions);
    app.get("/politician-likeness-per-channel/:politician", decodeUriParameter.politician, queriesController.politiciansLikenessPerChannel);
}
