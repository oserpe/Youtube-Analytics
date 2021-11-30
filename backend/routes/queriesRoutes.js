const queriesController = require("../controllers/queriesController");

module.exports = app => {
    app.get("/politician-time-per-channel/:politician", queriesController.politicianTimePerChannel);
    app.get("/politician-pairs-mentions/:channelName", queriesController.politiciansPairsMentions);
    app.get("/channel-names", queriesController.channelNames);
    app.get("/mentions/:query", queriesController.searchMentions);
    app.get("/politician-likeness-per-channel/:politician", queriesController.politiciansLikenessPerChannel);
}
