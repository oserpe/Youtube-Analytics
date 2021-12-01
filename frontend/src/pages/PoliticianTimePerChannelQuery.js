import { makeStyles } from "@mui/styles";
import React from "react";
import routes from "../routes";
import globalStyles from "../styles";
import QueryPage from "./QueryPage";

const ROUTE_INDEX = 1;

const useGlobalStyles = makeStyles(globalStyles);

const PoliticianTimePerChannelQuery = () => {
	const globalClasses = useGlobalStyles();
	const { title, description } = routes[ROUTE_INDEX];

	return (
		<QueryPage title={title} description={description}>
			<div className={globalClasses.actionsContainer}>
                {/* <SimpleAutocompleteDropdown /> */}
		</QueryPage>
	);
};

export default PoliticianTimePerChannelQuery;
