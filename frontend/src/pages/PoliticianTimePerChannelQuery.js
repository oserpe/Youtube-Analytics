import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";

import SimpleAutocompleteDropdown from "../components/SimpleAutocompleteDropdown";
import PoliticiansContext from "../context/PoliticiansContext";
import queries from "../queries";
import globalStyles from "../styles";
import QueryPage from "./QueryPage";
import ExecuteButton from "../components/ExecuteButton";
import { usePoliticianTimeQuery } from "../hooks";
import FullscreenCircularLoader from "../components/FullscreenCircularLoader";
import Table from "../components/Table";
import { CircularProgress } from "@mui/material";

const QUERY_INDEX = 0;

const columns = [
	{
		field: "channel",
		headerName: "Canal",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
	{
		field: "totalTime",
		headerName: "Tiempo total",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
];

const useGlobalStyles = makeStyles(globalStyles);

const PoliticianTimePerChannelQuery = () => {
	const globalClasses = useGlobalStyles();
	const { title, description, usedDatabases } = queries[QUERY_INDEX];

	const { politicians, isLoadingPoliticians } = useContext(PoliticiansContext);
	const [selectedPolitician, setSelectedPolitician] = React.useState("");
	const { getPoliticianTimeQueryResults } = usePoliticianTimeQuery();
	const [isLoadingQuery, setIsLoadingQuery] = useState(false);
	const [queryResults, setQueryResults] = useState([]);

	const isQueryExecuted = queryResults.length > 0;

	const handlePoliticianChange = (value) => {
		setSelectedPolitician(value);
	};

	const handleQuery = async () => {
		setIsLoadingQuery(true);
		const results = await getPoliticianTimeQueryResults(selectedPolitician);
		setQueryResults(results);
		setIsLoadingQuery(false);
	};

	return isLoadingPoliticians ? (
		<FullscreenCircularLoader />
	) : (
		<QueryPage
			title={title}
			description={description}
			usedDatabases={usedDatabases}
		>
			<div className={globalClasses.contentContainer}>
				<div className={globalClasses.actionsContainer}>
					<SimpleAutocompleteDropdown
						options={politicians}
						onChange={handlePoliticianChange}
						value={selectedPolitician}
						label="Político"
						icon={<PersonIcon fontSize="large" sx={{ mr: 1 }} />}
						getOptionLabel={(option) => option.politicianName || ""}
					/>
					<ExecuteButton disabled={!selectedPolitician} onClick={handleQuery} />
				</div>

				{isLoadingQuery ? (
					<div
						style={{
							height: "100%",
							width: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<CircularProgress />
					</div>
				) : isQueryExecuted ? (
					<Table
						rows={queryResults}
						columns={columns}
						pageSize={queryResults.length}
					/>
				) : (
					<div style={{ height: "100%", width: "100%" }}></div>
				)}
			</div>
		</QueryPage>
	);
};

export default PoliticianTimePerChannelQuery;
