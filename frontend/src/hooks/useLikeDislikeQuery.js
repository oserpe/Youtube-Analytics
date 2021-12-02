import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const useLikeDislikeQueryHook = () => {
	const getLikeDislikeQueryResults = async (politician) => {
		const encodedPolitician = encodeURIComponent(politician.fullname);

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
	};

	return {
		getLikeDislikeQueryResults,
	};
};

export default useLikeDislikeQueryHook;
