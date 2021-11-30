import React, { useContext, useState } from "react";
import routes from "../routes";
import QueryPage from "./QueryPage";
import Table from "../components/Table";
import { Autocomplete, Box, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExecuteButton from "../components/ExecuteButton";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import ChannelsContext from "../context/ChannelsContext";
import ytAnalyticsApi from "../apis/ytAnalyticsApi";
import FullscreenCircularLoader from "../components/FullscreenCircularLoader";

const ROUTE_INDEX = 0;

const columns = [
	{
		field: "pair",
		headerName: "Par",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
	{
		field: "timesMentioned",
		headerName: "Veces nombrado",
		type: "number",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
];
const rows = [
	{ id: 1, pair: "Macri - CFK", timesMentioned: 20 },
	{ id: 2, pair: "Macri - Alberto Fernández", timesMentioned: 330 },
	{ id: 3, pair: "Macri - CFK", timesMentioned: 20 },
	{ id: 4, pair: "Macri - Alberto Fernández", timesMentioned: 330 },
	{ id: 5, pair: "Macri - CFK", timesMentioned: 20 },
	{ id: 6, pair: "Macri - Alberto Fernández", timesMentioned: 330 },
	{ id: 7, pair: "Macri - CFK", timesMentioned: 20 },
	{ id: 8, pair: "Macri - Alberto Fernández", timesMentioned: 330 },
	{ id: 9, pair: "Macri - CFK", timesMentioned: 20 },
	{ id: 19, pair: "Macri - Alberto Fernández", timesMentioned: 330 },
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

	const { title, description } = routes[ROUTE_INDEX];

	const handleQuery = async () => {
		try {
			setIsLoadingQuery(true);
			const encodedChannel = selectedChannel.name.replace(" ", "_");
			const response = await ytAnalyticsApi.get(
				"/politicians-pairs-mentions/" + encodedChannel,
				{
					params: {
						page: currentPage + 1,
					},
				}
			);

			setQueryResults({ ...queryResults, [currentPage]: response.data });
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

		if (currentPage in queryResults) return;

		handleQuery();
	};

	return isLoadingChannels || isLoadingQuery ? (
		<FullscreenCircularLoader />
	) : (
		<QueryPage title={title} description={description}>
			<div className={classes.contentContainer}>
				<div className={classes.actionsContainer}>
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<LiveTvIcon fontSize="large" sx={{ mr: 1 }} />

						<Autocomplete
							value={selectedChannel}
							onChange={(_, value) => handleChange(value)}
							disablePortal
							options={channels}
							getOptionLabel={(option) => option.name || ""}
							sx={{ width: 300 }}
							renderInput={(params) => <TextField {...params} label="Canal" />}
						/>
					</Box>

					<div style={{ marginBottom: 0, marginTop: "auto" }}>
						<ExecuteButton onClick={handleQuery} disabled={!selectedChannel} />
					</div>
				</div>

				<Table
					page={currentPage}
					onPageChange={handlePageChange}
					rows={queryResults[currentPage]}
					columns={columns}
				/>
			</div>
		</QueryPage>
	);
};

export default PoliticianPairsQuery;
