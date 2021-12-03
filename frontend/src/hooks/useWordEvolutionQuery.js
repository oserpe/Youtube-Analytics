import ytAnalyticsApi from "../apis/ytAnalyticsApi";
import { formatDate } from "./utils";

const mapDataToRechartsFormat = (data) => {
	const rechartsData = [];

	const channels = data.map((row) => row.channelName);

	for (let i = 0; i < data[0].dateHistogram.length; i++) {
		const newRow = {
			date: formatDate(new Date(data[0].dateHistogram[i].date)),
		};
		for (let j = 0; j < channels.length; j++) {
			newRow[channels[j]] = data[j].dateHistogram[i].mentions;
		}

		rechartsData[i] = newRow;
	}

	return rechartsData;
};

const useWordEvolutionQueryHook = () => {
	const getWordEvolutionQueryResults = async (word, from, to, channels) => {
		try {
			const encodedWord = encodeURIComponent(word);
			const channelNames = channels.map((channel) => channel.channelName);

			const response = await ytAnalyticsApi.get(
				`/mentions-evolution/${encodedWord}`,
				{
					params: {
						from: formatDate(from),
						to: formatDate(to),
						channels: channelNames.join(","),
					},
				}
			);

			// Change to camelCase
			const data = response.data.map((row) => ({
				channelName: row.channel_name,
				dateHistogram: row.date_histogram,
			}));

			return mapDataToRechartsFormat(data);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getWordEvolutionQueryResults,
	};
};

export default useWordEvolutionQueryHook;
