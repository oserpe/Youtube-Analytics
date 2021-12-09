import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const Table = ({
	columns,
	rows = [],
	pageSize = 5,
	onPageChange = () => {},
	rowCount = pageSize,
	page = 0,
	paginationMode = "server",
	isLoading = false,
}) => {
	return (
		<div style={{ backgroundColor: "#f9f9f9", width: "100%", height: 500 }}>
			<DataGrid
				onPageChange={(number) => onPageChange(number)}
				page={page}
				rows={rows}
				columns={columns}
				pageSize={pageSize}
				rowCount={rowCount}
				paginationMode={paginationMode}
				loading={isLoading}
			/>
		</div>
	);
};

export default Table;
