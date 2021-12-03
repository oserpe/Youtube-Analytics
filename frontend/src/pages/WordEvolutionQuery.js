import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useContext, useEffect } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import SearchIcon from "@mui/icons-material/Search";
import {
	LineChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
	ResponsiveContainer,
} from "recharts";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";

import ExecuteButton from "../components/ExecuteButton";
import queries from "../queries";
import QueryPage from "./QueryPage";
import ChannelsContext from "../context/ChannelsContext";
import globalStyles from "../styles";
import FullscreenCircularLoader from "../components/FullscreenCircularLoader";
import { useWordEvolutionQuery } from "../hooks";

const QUERY_INDEX = 3;

const LINE_COLORS = [
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

const useStyles = makeStyles((theme) => ({}));
const useGlobalStyles = makeStyles(globalStyles);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const WordEvolutionQuery = () => {
	const classes = useStyles();
	const globalClasses = useGlobalStyles();
	const { channels, isLoadingChannels } = useContext(ChannelsContext);
	const { getWordEvolutionQueryResults } = useWordEvolutionQuery();
	const [queryResults, setQueryResults] = React.useState(null);
	const [isLoadingQuery, setIsLoadingQuery] = React.useState(false);
	const [selectedChannels, setSelectedChannels] = React.useState([]);
	const [from, setFrom] = React.useState(null);
	const [to, setTo] = React.useState(new Date());
	const [queryWord, setQueryWord] = React.useState("");

	const { title, description } = queries[QUERY_INDEX];

	const isDisabled =
		!queryWord.trim() || !selectedChannels.length || !from || !to;

	const renderLines = () => {
		const channels = [];
		Object.entries(queryResults[0]).forEach(([key, value]) => {
			if (key !== "date") {
				channels.push(key);
			}
		});

		return channels.map((channel, index) => (
			<Line
				type="monotone"
				dataKey={channel}
				stroke={LINE_COLORS[index]}
				dot={false}
			/>
		));
	};

	const handleQuery = async () => {
		setIsLoadingQuery(true);

		const results = await getWordEvolutionQueryResults(
			queryWord.trim(),
			from,
			to,
			selectedChannels
		);

		setQueryResults(results);
		setIsLoadingQuery(false);
	};

	const handleWordChange = (value) => {
		setQueryWord(value);
	};

	const handleFromChange = (date) => {
		setFrom(date);
	};

	const handleToChange = (date) => {
		setTo(date);
	};

	return isLoadingChannels ? (
		<FullscreenCircularLoader />
	) : (
		<LocalizationProvider dateAdapter={DateAdapter}>
			<QueryPage title={title} description={description}>
				<div className={globalClasses.contentContainer}>
					<div className={globalClasses.actionsContainer}>
						{/* word input */}
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<SearchIcon fontSize="large" sx={{ mr: 1 }} />
							<TextField
								value={queryWord}
								onChange={(e) => handleWordChange(e.target.value)}
								label="Palabra"
								variant="outlined"
							/>
						</Box>

						{/* channel selector */}
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<LiveTvIcon fontSize="large" sx={{ mr: 1 }} />
							<Autocomplete
								multiple
								id="checkboxes-tags-demo"
								options={channels}
								value={selectedChannels}
								onChange={(_, value) => setSelectedChannels(value)}
								disableCloseOnSelect
								getOptionLabel={(option) => option.channelName}
								renderOption={(props, option, { selected }) => (
									<li {...props}>
										<Checkbox
											icon={icon}
											checkedIcon={checkedIcon}
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{option.channelName}
									</li>
								)}
								style={{ width: 300 }}
								renderInput={(params) => (
									<TextField {...params} label="Canales" />
								)}
							/>
						</Box>

						<DesktopDatePicker
							label="Desde"
							inputFormat="dd/MM/yyyy"
							value={from}
							onChange={handleFromChange}
							renderInput={(params) => <TextField {...params} />}
							maxDate={new Date()}
						/>

						<DesktopDatePicker
							label="Hasta"
							inputFormat="dd/MM/yyyy"
							value={to}
							onChange={handleToChange}
							renderInput={(params) => <TextField {...params} />}
							maxDate={new Date()}
						/>

						<div style={{ marginBottom: 0, marginTop: "auto" }}>
							<ExecuteButton onClick={handleQuery} disabled={isDisabled} />
						</div>
					</div>

					{queryResults ? (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={queryResults}
								margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
							>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" />
								<YAxis />
								<Tooltip />
								<Legend />
								{renderLines()}
							</LineChart>
						</ResponsiveContainer>
					) : (
						<div style={{ height: "100%", width: "100%" }}></div>
					)}
				</div>
			</QueryPage>
		</LocalizationProvider>
	);
};

export default WordEvolutionQuery;
