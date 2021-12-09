import React, { useContext, useState } from "react";
import { CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExecuteButton from "../components/ExecuteButton";
import LiveTvIcon from "@mui/icons-material/LiveTv";

import queries from "../queries";
import QueryPage from "./QueryPage";
import ChannelsContext from "../context/ChannelsContext";
import FullscreenCircularLoader from "../components/FullscreenCircularLoader";
import { usePartyMentionsQuery } from "../hooks";
import SimpleAutocompleteDropdown from "../components/SimpleAutocompleteDropdown";
import globalStyles from "../styles";
import { Cell, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Legend, Tooltip } from "recharts";

const QUERY_INDEX = 4;

const PIE_COLORS = [
	"#8884d8",
	"#82ca9d",
	"#ffc658",
	"#ff8c42",
	"#b2df8a",
	"#33a02c",
	"#fb9a99",
	"#e31a1c",
	"#fdbf6f",
	"#ff7f00",
	"#cab2d6",
	"#6a3d9a",
	"#ffff99",
	"#b15928",
	"#a6cee3",
	"#1f78b4",
	"#00c4ff",
];
const useGlobalStyles = makeStyles(globalStyles);

const PartyMentionsQuery = () => {
	const globalClasses = useGlobalStyles();
	const { channels, isLoadingChannels } = useContext(ChannelsContext);
	const [queryResults, setQueryResults] = useState(null);
	const [isLoadingQuery, setIsLoadingQuery] = useState(false);
	const [selectedChannel, setSelectedChannel] = useState("");
	const { getPartyMentionsQueryResults } = usePartyMentionsQuery();

	const { title, description, usedDatabases } = queries[QUERY_INDEX];
	const isQueryExecuted = queryResults !== null;

	const handleQuery = async () => {
		setIsLoadingQuery(true);

		const results = await getPartyMentionsQueryResults(selectedChannel);
		setQueryResults(results);

		setIsLoadingQuery(false);
	};

	const handleChange = (value) => {
		setSelectedChannel(value);
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
					<div className={globalClasses.chartContainer}>
						<PieChart>
							<Pie
								height={500}
								width={1000}
								data={queryResults}
								dataKey="mentions"
								nameKey="party"
								cx="50%"
								cy="50%"
								outerRadius={150}
								fill="#82ca9d"
								label
							>
								{queryResults.map((entry, index) => (
									<Cell
										key={index}
										fill={PIE_COLORS[index % PIE_COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</div>
				) : (
					<div style={{ height: "100%", width: "100%" }}></div>
				)}
			</div>
		</QueryPage>
	);
};

export default PartyMentionsQuery;
