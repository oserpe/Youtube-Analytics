import { createContext, useEffect, useState } from "react";
import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const ChannelsContext = createContext(null);

export const ChannelsContextProvider = ({ children }) => {
	const [channels, setChannels] = useState([""]);
	const [isLoadingChannels, setIsLoadingChannels] = useState(true);

	const fetchChannels = async () => {
		try {
			const response = await ytAnalyticsApi.get("/channel-names");

			// Change to camelCase
			const data = response.data.map((channel) => ({
				channelName: channel.channel_name,
			}));

			setChannels(data);
			setIsLoadingChannels(false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchChannels();
	}, []);

	return (
		<ChannelsContext.Provider
			value={{ channels, setChannels, isLoadingChannels }}
		>
			{children}
		</ChannelsContext.Provider>
	);
};

export default ChannelsContext;
