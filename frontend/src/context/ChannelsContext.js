import { createContext, useEffect, useState } from "react";
import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const ChannelsContext = createContext(null);

export const ChannelsContextProvider = ({ children }) => {
	const [channels, setChannels] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchChannels = async () => {
		try {
			const response = await ytAnalyticsApi.get("/channels-name");
			setChannels(response.data);
			setIsLoading(false);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchChannels();
	}, []);

	return (
		<ChannelsContext.Provider value={{ channels, setChannels, isLoading }}>
			{children}
		</ChannelsContext.Provider>
	);
};

export default ChannelsContext;
