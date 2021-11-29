const queriesController = require("../controllers/queriesController");

module.exports = app => {
    app.get("/politician-time-per-channel/:politician", queriesController.politicianTimePerChannel);
    app.get("/politicians-pairs-mentions/:channelName", queriesController.politiciansPairsMentions);
}