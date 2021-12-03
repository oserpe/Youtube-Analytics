import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const useLikeDislikeQueryHook = () => {
	const getLikeDislikeQueryResults = async (politician) => {
		try {
			const encodedPolitician = encodeURIComponent(politician.politicianName);

			const response = await ytAnalyticsApi.get(
				`/politician-likeness-per-channel/${encodedPolitician}`
			);

			return response.data.map((row) => ({
				id: row._id,
				channel: row.channel_name,
				likes: row.likes,
				dislikes: row.dislikes,
				likeDislikeRatio:
					row.dislikes === 0
						? null
						: (Math.round((row.likes / row.dislikes) * 100) / 100).toFixed(2),
			}));
		} catch (error) {
			console.error(error);
		}
	};

	return {
		getLikeDislikeQueryResults,
	};
};

export default useLikeDislikeQueryHook;
