function channels(req, res, next) {
    if(!req.query || !req?.query.channels) {
        req.query = {};
        next();
        return;
    }
    req.query.channels = decodeURIComponent(req.query.channels).split(",");
    next();
}

module.exports = {
    channels
}