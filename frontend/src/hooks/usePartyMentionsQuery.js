import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const usePartyMentionsQueryHook = () => {
	const getPartyMentionsQueryResults = async (channel) => {
		try {
			const encodedChannel = encodeURIComponent(channel.channelName);

			const response = await ytAnalyticsApi.get(
				`/party-mentions/${encodedChannel}`
			);

			return response.data.map((row) => ({
				party: row.party,
				mentions: row.mentions,
			}));
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getPartyMentionsQueryResults,
	};
};

export default usePartyMentionsQueryHook;
