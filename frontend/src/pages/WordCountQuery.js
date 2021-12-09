import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Box, CircularProgress, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterDateFns";

import queries from "../queries";
import globalStyles from "../styles";
import QueryPage from "./QueryPage";
import ExecuteButton from "../components/ExecuteButton";
import { useWordCountQuery } from "../hooks";
import Table from "../components/Table";

const QUERY_INDEX = 1;

const columns = [
	{
		field: "channel",
		headerName: "Canal",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
	{
		field: "mentions",
		type: "number",
		headerName: "Cantidad de menciones",
		flex: 1,
		headerAlign: "left",
		align: "left",
	},
];

const useGlobalStyles = makeStyles(globalStyles);

const WordCountQuery = () => {
	const globalClasses = useGlobalStyles();
	const { title, description } = queries[QUERY_INDEX];

	const [queryWord, setQueryWord] = React.useState("");
	const [queryDate, setQueryDate] = React.useState(null);
	const { getWordCountQueryResults } = useWordCountQuery();
	const [isLoadingQuery, setIsLoadingQuery] = useState(false);
	const [queryResults, setQueryResults] = useState([]);
	const [isQueryEmpty, setIsQueryEmpty] = useState(false);

	const isQueryExecuted = queryResults.length > 0 || isQueryEmpty;

	const handleQuery = async () => {
		setIsLoadingQuery(true);
		const results = await getWordCountQueryResults(queryWord.trim(), queryDate);

		setQueryResults(results);

		if (results.length > 0) {
			setIsQueryEmpty(false);
		} else {
			setIsQueryEmpty(true);
		}

		setIsLoadingQuery(false);
	};

	const handleWordChange = (value) => {
		setQueryWord(value);
	};

	const handleDateChange = (value) => {
		setQueryDate(value);
	};

	return (
		<LocalizationProvider dateAdapter={DateAdapter}>
			<QueryPage title={title} description={description}>
				<div className={globalClasses.contentContainer}>
					<div className={globalClasses.actionsContainer}>
						<Box sx={{ display: "flex", alignItems: "center" }}>
							<SearchIcon fontSize="large" />
							<TextField
								value={queryWord}
								onChange={(e) => handleWordChange(e.target.value)}
								label="Palabra"
								variant="outlined"
							/>
						</Box>

						<DesktopDatePicker
							label="Desde"
							inputFormat="dd/MM/yyyy"
							value={queryDate}
							onChange={handleDateChange}
							renderInput={(params) => <TextField {...params} />}
							maxDate={new Date()}
						/>

						<ExecuteButton
							disabled={!queryWord.trim() || !queryDate}
							onClick={handleQuery}
						/>
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
		</LocalizationProvider>
	);
};

export default WordCountQuery;
