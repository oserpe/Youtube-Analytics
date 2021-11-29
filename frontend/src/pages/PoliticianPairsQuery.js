import React from "react";
import routes from "../routes";
import QueryPage from "./QueryPage";
import { DataGrid } from "@mui/x-data-grid";

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
];

const PoliticianPairsQuery = () => {
	const { title, description } = routes[ROUTE_INDEX];

	const renderTable = (columns, rows) => {
		return (
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
			/>
		);
	};

	return (
		<QueryPage
			title={title}
			description={description}
			dataVisualizer={renderTable(columns, rows)}
		/>
	);
};

export default PoliticianPairsQuery;
