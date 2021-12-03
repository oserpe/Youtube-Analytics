import ytAnalyticsApi from "../apis/ytAnalyticsApi";
import { formatDate } from "./utils";

const useWordCountQueryHook = () => {
	const getWordCountQueryResults = async (word, from) => {
		try {
			const encodedWord = encodeURIComponent(word);

			const response = await ytAnalyticsApi.get(`/mentions/${encodedWord}`, {
				params: {
					from: formatDate(from),
				},
			});

			return response.data.map((row) => ({
				id: row.channel_name,
				channel: row.channel_name,
				mentions: row.mentions,
			}));
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getWordCountQueryResults,
	};
};

export default useWordCountQueryHook;
