import React, { useContext, useEffect, useState } from "react";
import { Autocomplete, Box, CircularProgress, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExecuteButton from "../components/ExecuteButton";
import LiveTvIcon from "@mui/icons-material/LiveTv";

import routes from "../routes";
import QueryPage from "./QueryPage";
import Table from "../components/Table";
import ChannelsContext from "../context/ChannelsContext";
import FullscreenCircularLoader from "../components/FullscreenCircularLoader";
import { usePairsQuery } from "../hooks";
import SimpleAutocompleteDropdown from "../components/SimpleAutocompleteDropdown";

const ROUTE_INDEX = 0;
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

const useStyles = makeStyles((theme) => ({
	contentContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		margin: "3rem auto",
		height: 675,
		width: "80%",
	},
	actionsContainer: {
		display: "flex",
		justifyContent: "space-between",
		marginBottom: "1rem",
	},
}));

const PoliticianPairsQuery = () => {
	const classes = useStyles();
	const { channels, isLoadingChannels } = useContext(ChannelsContext);
	const [queryResults, setQueryResults] = useState({});
	const [currentPage, setCurrentPage] = useState(0);
	const [isLoadingQuery, setIsLoadingQuery] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState("");
	const { links, getPairsQueryResults } = usePairsQuery();

	const { title, description } = routes[ROUTE_INDEX];
	const isQueryExecuted = Object.keys(queryResults).length > 0;

	useEffect(() => {
		if (currentPage in queryResults || !isQueryExecuted) return;

		handleQuery();
	}, [currentPage]);

	const handleQuery = async () => {
		try {
			setIsLoadingQuery(true);

			const results = await getPairsQueryResults(selectedChannel, currentPage);
			setQueryResults({ ...queryResults, [currentPage]: results });

			setIsLoadingQuery(false);
		} catch (error) {
			console.log(error);
		}
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
		<QueryPage title={title} description={description}>
			<div className={classes.contentContainer}>
				<div className={classes.actionsContainer}>
					<SimpleAutocompleteDropdown
						options={channels}
						onChange={handleChange}
						value={selectedChannel}
						label="Canal"
						icon={<LiveTvIcon fontSize="large" sx={{ mr: 1 }} />}
					/>

					<div style={{ marginBottom: 0, marginTop: "auto" }}>
						<ExecuteButton onClick={handleQuery} disabled={!selectedChannel} />
					</div>
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
