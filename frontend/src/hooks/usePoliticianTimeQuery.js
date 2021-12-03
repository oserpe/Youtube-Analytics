import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const formatTime = (ms) => {
	let seconds = ms / 1000;
	const hours = Math.floor(seconds / 3600); // 3,600 seconds in 1 hour
	seconds = seconds % 3600; // seconds remaining after extracting hours
	const minutes = Math.floor(seconds / 60); // 60 seconds in 1 minute
	seconds = seconds % 60;
	return hours + " hs " + minutes + " m " + seconds + " s";
};

const usePoliticianTimeQueryHook = () => {
	const getPoliticianTimeQueryResults = async (politician) => {
		try {
			const encodedPolitician = encodeURIComponent(politician.politicianName);

			const response = await ytAnalyticsApi.get(
				`/politician-time-per-channel/${encodedPolitician}`
			);

			return response.data.map((row) => ({
				id: row._id,
				channel: row.channel_name,
				totalTime: formatTime(row.total_time),
			}));
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getPoliticianTimeQueryResults,
	};
};

export default usePoliticianTimeQueryHook;
