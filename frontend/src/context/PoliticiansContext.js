import { createContext, useEffect, useState } from "react";
import ytAnalyticsApi from "../apis/ytAnalyticsApi";

const PoliticiansContext = createContext(null);

export const PoliticiansContextProvider = ({ children }) => {
	const [politicians, setPoliticians] = useState([""]);
	const [isLoadingPoliticians, setIsLoadingPoliticians] = useState(true);

	const fetchPoliticians = async () => {
		try {
			const response = await ytAnalyticsApi.get("/politicians");

			// Change to camelCase
			const data = response.data.map((channel) => ({
				politicianName: channel.politicianName,
			}));

			setPoliticians(data);
			setIsLoadingPoliticians(false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPoliticians();
	}, []);

	return (
		<PoliticiansContext.Provider
			value={{ politicians, setPoliticians, isLoadingPoliticians }}
		>
			{children}
		</PoliticiansContext.Provider>
	);
};

export default PoliticiansContext;
