import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const formatDate = (date) => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	if (month < 10) return `${day}/0${month}/${year}`;

	return `${day}/${month}/${year}`;
};

const useWordCountQueryHook = () => {
	const getWordCountQueryResults = async (word, from) => {
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
	};

	return {
		getWordCountQueryResults,
	};
};

export default useWordCountQueryHook;
