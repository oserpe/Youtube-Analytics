import React, { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExecuteButton from "../components/ExecuteButton";
import LiveTvIcon from "@mui/icons-material/LiveTv";

import queries from "../queries";
import QueryPage from "./QueryPage";
import Table from "../components/Table";
import ChannelsContext from "../context/ChannelsContext";
import FullscreenCircularLoader from "../components/FullscreenCircularLoader";
import { usePairsQuery } from "../hooks";
import SimpleAutocompleteDropdown from "../components/SimpleAutocompleteDropdown";
import globalStyles from "../styles";

const QUERY_INDEX = 5;
const PAGE_SIZE = 8;

const columns = [
	{
		field: "pair",
		headerName: "Par",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
	{
		field: "mentions",
		headerName: "Veces nombrado",
		type: "number",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
];

const useGlobalStyles = makeStyles(globalStyles);

const PoliticianPairsQuery = () => {
	const globalClasses = useGlobalStyles();
	const { channels, isLoadingChannels } = useContext(ChannelsContext);
	const [queryResults, setQueryResults] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [isLoadingQuery, setIsLoadingQuery] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState("");
	const { links, getPairsQueryResults } = usePairsQuery();

	const { title, description, usedDatabases } = queries[QUERY_INDEX];
	const isQueryExecuted = Object.keys(queryResults).length > 0;

	useEffect(() => {
		if (currentPage in queryResults || !isQueryExecuted) return;

		handleQuery();
	}, [currentPage]);

	const handleQuery = async () => {
		setIsLoadingQuery(true);

		const results = await getPairsQueryResults(selectedChannel, currentPage);
		setQueryResults({ ...queryResults, [currentPage]: results });

		setIsLoadingQuery(false);
	};

	const handleChange = (value) => {
		setSelectedChannel(value);
	};

	const handlePageChange = (number) => {
		setCurrentPage(number);
	};

	return isLoadingChannels ? (
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
						options={channels}
						onChange={handleChange}
						value={selectedChannel}
						label="Canal"
						icon={<LiveTvIcon fontSize="large" sx={{ mr: 1 }} />}
						getOptionLabel={(option) => option.channelName || ""}
					/>

					<ExecuteButton onClick={handleQuery} disabled={!selectedChannel} />
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
						page={currentPage}
						onPageChange={handlePageChange}
						rows={queryResults[currentPage]}
						columns={columns}
						pageSize={PAGE_SIZE}
						rowCount={links.last?.page * PAGE_SIZE}
					/>
				) : (
					<div style={{ height: "100%", width: "100%" }}></div>
				)}
			</div>
		</QueryPage>
	);
};

export default PoliticianPairsQuery;
