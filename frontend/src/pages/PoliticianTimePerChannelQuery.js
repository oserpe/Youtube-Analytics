import React from "react";
import routes from "../routes";
import QueryPage from "./QueryPage";

const ROUTE_INDEX = 1;

const PoliticianTimePerChannelQuery = () => {
	const { title, description } = routes[ROUTE_INDEX];
	return (
		<QueryPage title={title} description={description}>
			aaa
		</QueryPage>
	);
};

export default PoliticianTimePerChannelQuery;
