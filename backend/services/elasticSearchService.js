const elasticDB = require("../databases/elasticsearch");
const ELASTIC_SEARCH_SIZE = 10000;

function getDateFromStringOrDefault(dateParam, defaultDate, isFrom) {
	if (dateParam) {
		const dateParts = dateParam.split("/");
		// month is 0-based, that's why we need dataParts[1] - 1
		const dateParsed = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
		if (isFrom) {
			if (dateParsed > new Date())
				throw new Error("ElasticSearch Service: From must be a date in the past");
		} else {
			if (dateParsed > new Date())
				throw new Error("ElasticSearch Service: To must be a date in the past or today");
		}

		return dateParsed;
	} else {
		let aux = new Date();
		aux.setDate(defaultDate);
		return aux;
	}
}

async function getSearchMentions(query, from, to) {
	const elasticClient = elasticDB.getDB();
	from = getDateFromStringOrDefault(from, new Date().getDate() - 14, true);
	to = getDateFromStringOrDefault(to, new Date().getDate(), false);

	if (to < from) {
		throw new Error("ElasticSearch Service: To must be after From");
	}

	const { body } = await elasticClient.search({
		index: "videos",
		body: {
			explain: true,
			size: 0,
			query: {
				bool: {
					must: [
						{
							query_string: {
								fields: ["title", "description"],
								query: query,
								default_operator: "AND",
							},
						},
						{
							range: {
								published_at: {
									gte: from,
									lte: to
								},
							},
						},
					],
				},
			},
			//ORDENADO PERO NO PAGINADO
			aggs: {
				results: {
					terms: {
						field: "channel_id",
						size: ELASTIC_SEARCH_SIZE,
					},
				},
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
		},
	});
	return body.aggregations.results.buckets;
}

async function getMentionsEvolution(query, channelsId, from, to) {
	const elasticClient = elasticDB.getDB();
	const channelsQueryString = channelsId.map((id) => `(${id})`).join(" OR ");
	from = getDateFromStringOrDefault(from, new Date().getDate() - 14, true);
	console.log(from);
	to = getDateFromStringOrDefault(to, new Date().getDate(), false);

	if (to < from) {
		throw new Error("ElasticSearch Service: To must be after From");
	}

	const { body } = await elasticClient.search({
		index: "videos",
		body: {
			size: 0,
			query: {
				bool: {
					must: [
						{
							query_string: {
								fields: ["title", "description"],
								query: query,
								default_operator: "AND",
							},
						},
						{
							query_string: {
								fields: ["channel_id"],
								query: channelsQueryString,
								default_operator: "AND",
							},
						},
						{
							range: {
								published_at: {
									gte: from,
									lte: to
								},
							},
						}
					],
				},
			},
			aggs: {
				channels: {
					terms: {
						field: "channel_id",
					},
					aggs: {
						dates_mentions: {
							date_histogram: {
								field: "published_at",
								interval: "1d",
								extended_bounds: {
									min: from,
									max: to,
								},
								min_doc_count: 0
							}
						}
					},
				},
			}
		}
	});

	const result = body.aggregations.channels.buckets.map(channel => {
		const channelMentionsData = {
			id: channel.key,
			date_histogram: []
		};
		channel.dates_mentions.buckets.forEach(dateMentions => {
			channelMentionsData.date_histogram.push({
				date: dateMentions.key_as_string,
				mentions: dateMentions.doc_count
			});
		});

		return channelMentionsData;
	})

	const missingChannels = channelsId
		.filter(id => !result.map(channel => channel.id).includes(id))
		.map(id => {
			const channelMentionsData = {
				id: id,
				date_histogram: []
			};

			for (let index = new Date(from.getTime() - from.getTimezoneOffset() * 60 * 1000); index <= to; index.setDate(index.getDate() + 1)) {
				channelMentionsData.date_histogram.push({
					date: index.toISOString(),
					mentions: 0
				});
			}
			return channelMentionsData;
		});

	return [...result, ...missingChannels];
}

module.exports = {
	getSearchMentions,
	getMentionsEvolution,
};
