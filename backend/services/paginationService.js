const { link } = require("fs");

function getPaginatedResponse(response, page, maxPage, path) {
	if (maxPage > 0) {
		let links = {};
		if (page != 1) {
			links['first'] = path + '?page=1';
			if (page > 1 && page < maxPage)
				link['prev'] = path + '?page=' + (page - 1);
		}

		if (page != maxPage) {
			links['last'] = path + '?page=' + maxPage;
			if (page >= 1 && page < maxPage)
				links['next'] = path + '?page=' + (page + 1);
		}
	}
	response.links(links);
	return response;
}

module.exports = {
	getPaginatedResponse,
}