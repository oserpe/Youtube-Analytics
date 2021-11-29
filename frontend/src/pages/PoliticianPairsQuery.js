import React from "react";
import routes from "../routes";
import QueryPage from "./QueryPage";
import Table from "../components/Table";
import { Autocomplete, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExecuteButton from "../components/ExecuteButton";

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

const channels = [
	{ label: "TN" },
	{ label: "C5N" },
	{ label: "La Nación+" },
	{ label: "América TV" },
	{ label: "El Trece" },
	{ label: "Crónica TV" },
	{ label: "El Destape" },
	{ label: "A24" },
];

const useStyles = makeStyles((theme) => ({
	contentContainer: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		margin: "3rem auto",
		height: 650,
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

	const { title, description } = routes[ROUTE_INDEX];

	return (
		<QueryPage title={title} description={description}>
			<div className={classes.contentContainer}>
				<div className={classes.actionsContainer}>
					<Autocomplete
						disablePortal
						id="combo-box-demo"
						options={channels}
						sx={{ width: 300 }}
						renderInput={(params) => <TextField {...params} label="Canal" />}
					/>

					<div style={{ marginBottom: 0, marginTop: "auto" }}>
						<ExecuteButton onClick={() => {}} />
					</div>
				</div>
				<Table rows={rows} columns={columns} />
			</div>
		</QueryPage>
	);
};

export default PoliticianPairsQuery;
