const elasticDB = require("../databases/elasticsearch");
const ELASTIC_SEARCH_SIZE = 10000;

async function getSearchMentions(query, from, page) {
	const elasticClient = elasticDB.getDB();
	page = page || 1;
	if (page < 1) {
		throw new Error("ElasticSearch Service: Page must be greater than 0");
	}

	if (from) {
		const dateParts = from.split("/");
		// month is 0-based, that's why we need dataParts[1] - 1
		from = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
		if (from > new Date())
			throw new Error("ElasticSearch Service: From must be a date in the past");
	} else {
		from = new Date().setDate(new Date().getDate() - 7);
	}

	const { body } = await elasticClient.search({
		index: "videos",
		body: {
			size: 0,
			query: {
				bool: {
					must: [{
						query_string: {
							fields: ["title", "description"],
							query: query,
							default_operator: "AND",
						}
					},
					{
						range: {
							published_at: {
								gte: from,
							}
						}
					}]
				}
			},
			//ORDENADO PERO NO PAGINADO
			aggs: {
				results: {
					terms: {
						field: "channel_id",
						size: ELASTIC_SEARCH_SIZE
					}
				}
			},

			//PAGINADO PERO NO ORDENADO
			// aggs: {
			// 	results: {
			// 		composite: {
			// 			size: 2,
			// 			sources: [
			// 				{
			// 					channel: {

			// 						terms: {
			// 							field: 'channel_id'
			// 						}
			// 					}
			// 				}
			// 			]
			// 		}
			// 	},
			// }
		}
	});

	console.log(body);
	return body.aggregations.results.buckets;
}

module.exports = {
	getSearchMentions
}
