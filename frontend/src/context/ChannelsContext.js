import { createContext, useEffect, useState } from "react";
import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const ChannelsContext = createContext(null);

export const ChannelsContextProvider = ({ children }) => {
	const [channels, setChannels] = useState([""]);
	const [isLoadingChannels, setIsLoadingChannels] = useState(true);

	const fetchChannels = async () => {
		try {
			const response = await ytAnalyticsApi.get("/channel-names");

			setChannels(response.data);
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
