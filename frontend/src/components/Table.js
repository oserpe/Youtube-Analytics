import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const Table = ({ columns, rows, pageSize = 10 }) => {
	return (
		<div style={{ backgroundColor: "#f9f9f9", width: "100%", height: "100%" }}>
			<DataGrid rows={rows} columns={columns} pageSize={pageSize} />
		</div>
	);
};

export default Table;
