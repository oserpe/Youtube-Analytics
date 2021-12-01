function politician(req, res, next) {
    req.params.politician = decodeURIComponent(req.params.politician);
    next();
}

function channelName(req, res, next) {
    req.params.channelName = decodeURIComponent(req.params.channelName);
    next();
}

function query(req, res, next) {
    req.params.query = decodeURIComponent(req.params.query);
    next();
}

module.exports = {
    politician,
    channelName,
    query
}