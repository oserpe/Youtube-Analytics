const elasticDB = require("../databases/elasticsearch");
const ELASTIC_SEARCH_SIZE = 10000;

async function getSearchMentions(query, from) {
	const elasticClient = elasticDB.getDB();

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

async function getMentionsEvolution(query, channelsId) {
	const elasticClient = elasticDB.getDB();
	const channelsQueryString = channelsId.map((id) => `(${id})`).join(" OR ");
	const from = new Date().setDate(new Date().getDate() - 14);

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
									max: new Date(),
								},
							}
						}
					},
					// sales_over_time: {
					// 	date_histogram: {
					// 		field: "published_at",
					// 		interval: "1d",
					// 		extended_bounds: {
					// 			min: from,
					// 			max: new Date(),
					// 		},
					// 	}
					// }
					// aggs: {
					// 	resellers: {
					// 		nested: {
					// 			path: "channel_id"
					// 		},
					// 		aggs: {
					// 			sales_over_time: {
					// 				date_histogram: {
					// 					field: "published_at",
					// 					interval: "1d",
					// 					extended_bounds: {
					// 						min: from,
					// 						max: new Date(),
					// 					},
					// 				}
					// 			}
					// 		}
					// 	}
					// }
					// aggs: {
					// 	channels: {
					// 		terms: {
					// 			field: "channel_id",
					// 		},
					// 		aggs: {
					// 			name: { terms: { field: "published_at" } },
					// 		}
					// 	},
					// 	sales_over_time: {
					// 		date_histogram: {
					// 			field: "published_at",
					// 			interval: "1d",
					// 			extended_bounds: {
					// 				min: from,
					// 				max: new Date(),
					// 			},
					// 		}
					// 	}
					// }
					// aggs: {
					// 	filterByDate: {
					// 		filter: {
					// 			range: {
					// 				published_at: {
					// 					gte: from,
					// 				},
					// 			},
					// 		},
					// 		aggs: {
					// 			dateStats: {
					// 				date_histogram: {
					// 					field: "published_at",
					// 					interval: "day",
					// 					extended_bounds: {
					// 						min: from,
					// 						max: new Date(),
					// 					},
					// 				},
					// 			},
					// 		},
					// 	},
					// },
				},
			}
		}
	});

	console.log(body.aggregations.channels.buckets)
	const result = body.aggregations.channels.buckets.map(channel => {
		console.log(channel.key)
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



	// console.log(body.aggregations.channels.buckets)
	// body.aggregations.channels.buckets.forEach(c => {
	// 	console.log("CHANNEL:" + c.key, c.name.buckets)
	// })

	return result;
}

module.exports = {
	getSearchMentions,
	getMentionsEvolution,
};
