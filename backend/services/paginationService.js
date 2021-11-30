function getPaginatedResponse(res, pageString, maxPageString, path) {
	page = parseInt(pageString) || 1;
	maxPage = parseInt(maxPageString);
	const fullPath = process.env.SERVER_API + path;
	if (maxPage > 0) {
		if (page != 1) {
			res.append("Link", `<${fullPath}?page=1>; rel="first"`);
			if (page > 1 && page < maxPage)
				res.append("Link", `<${fullPath}?page=${page - 1}>; rel="prev"`);
		}

		if (page != maxPage) {
			res.append("Link", `<${fullPath}?page=${maxPage}>; rel="last"`);
			if (page >= 1 && page < maxPage)
				res.append("Link", `<${fullPath}?page=${page + 1}>; rel="next"`);
		}
	}
}

module.exports = {
	getPaginatedResponse,
}