import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
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

import channels from "../channels";
import ExecuteButton from "../components/ExecuteButton";
import routes from "../routes";
import QueryPage from "./QueryPage";

const ROUTE_INDEX = 3;

const data = [
	{ date: "01/21", C5N: 2400, TN: 400 },
	{ date: "02/21", C5N: 200, TN: 2300 },
	{ date: "03/21", C5N: 40, TN: 2000 },
	{ date: "04/21", C5N: 200, TN: 1500 },
	{ date: "05/21", C5N: 700, TN: 1000 },
	{ date: "06/21", C5N: 100, TN: 500 },
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const WordEvolutionQuery = () => {
	const classes = useStyles();

	const { title, description } = routes[ROUTE_INDEX];

	return (
		<QueryPage title={title} description={description}>
			<div className={classes.contentContainer}>
				<div className={classes.actionsContainer}>
					{/* channel selector */}
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<LiveTvIcon fontSize="large" sx={{ mr: 1 }} />
						<Autocomplete
							multiple
							id="checkboxes-tags-demo"
							options={channels}
							disableCloseOnSelect
							getOptionLabel={(option) => option.label}
							renderOption={(props, option, { selected }) => (
								<li {...props}>
									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option.label}
								</li>
							)}
							style={{ width: 500 }}
							renderInput={(params) => (
								<TextField {...params} label="Canales" />
							)}
						/>
					</Box>

					{/* word input */}
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<SearchIcon fontSize="large" sx={{ mr: 1 }} />
						<TextField label="Palabra" />
					</Box>

					<div style={{ marginBottom: 0, marginTop: "auto" }}>
						<ExecuteButton onClick={() => {}} />
					</div>
				</div>

				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="C5N" stroke="#8884d8" />
						<Line type="monotone" dataKey="TN" stroke="#82ca9d" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</QueryPage>
	);
};

export default WordEvolutionQuery;
