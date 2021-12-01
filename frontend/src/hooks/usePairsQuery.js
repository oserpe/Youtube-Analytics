import { useState } from "react";
import ytAnalyticsApi from "../apis/ytAnalyticsApi";
import parseLinkHeader from "parse-link-header";

const usePairsQueryHook = () => {
	const initialLinks = {
		last: {
			page: 1,
			rel: "last",
			url: null,
		},
		next: {
			page: 1,
			rel: "next",
			url: null,
		},
		prev: {
			page: 1,
			rel: "prev",
			url: null,
		},
		first: {
			page: 1,
			rel: "first",
			url: null,
		},
	};

	const [links, setLinks] = useState({ ...initialLinks });

	const getPairsQueryResults = async (channel, page) => {
		const encodedChannel = encodeURIComponent(channel.name);

		const response = await ytAnalyticsApi.get(
			`/politician-pairs-mentions/${encodedChannel}`,
			{
				params: {
					page: page + 1,
				},
			}
		);

		setLinks(parseLinkHeader(response.headers.link) || initialLinks);

		return response.data.map((p) => ({
			id: p.firstPolitician + " - " + p.secondPolitician,
			pair: p.firstPolitician + " - " + p.secondPolitician,
			mentions: p.mentions,
		}));
	};

	return {
		getPairsQueryResults,
		links,
	};
};

export default usePairsQueryHook;
