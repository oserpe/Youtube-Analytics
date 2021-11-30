import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const Table = ({
	columns,
	rows,
	pageSize = 5,
	onPageChange,
	rowCount = 100,
	page,
}) => {
	return (
		<div style={{ backgroundColor: "#f9f9f9", width: "100%", height: "100%" }}>
			<DataGrid
				onPageChange={(number) => onPageChange(number)}
				page={page}
				rows={rows}
				columns={columns}
				pageSize={pageSize}
				rowCount={rowCount}
			/>
		</div>
	);
};

export default Table;
